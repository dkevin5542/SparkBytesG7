from flask import Blueprint, request, session, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from database import get_db_connection
import os

oauth_bp = Blueprint('oauth_bp', __name__)
         
@oauth_bp.route('/api/google-login', methods=['POST'])
def google_login():
    """
    Handles Google OAuth login. Only specific domains (e.g., @bu.edu) are allowed.
    """
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'message': 'Token is missing'}), 400

    try:
        # Verify the token with Google's OAuth2 API
        idinfo = id_token.verify_oauth2_token(token, requests.Request())

        # Check if the token is issued by Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify({'message': 'Wrong issuer.'}), 401

        # Extract user information
        user_id = idinfo['sub'] # unique Google ID
        email = idinfo['email']
        name = idinfo.get('name', 'Anonymous')

        # Validate email domain (e.g., @bu.edu)
        if not email.lower().endswith('@bu.edu'):
            return jsonify({'message': 'Unauthorized domain. Only @bu.edu emails are allowed.'}), 403

        # Check if user exists; create user if not found
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM User WHERE user_id = ?", (user_id,))
            user = cursor.fetchone()

            if not user:
                cursor.execute(
                    """
                    INSERT INTO User (user_id, email, name, diet, preferred_language, role)
                    VALUES (?, ?, ?, 'Omnivore', 'English', 'Student')
                    """,
                    (user_id, email, name)
                )
                conn.commit()

        # Store user_id in session
        session['user_id'] = user_id

        print('user_id is:')
        print(session['user_id'])
        return jsonify({
            'message': 'Login successful',
            'user_id': user_id,
            'email': email
        }), 200

    except ValueError:
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

@oauth_bp.route('/api/google-logout', methods=['POST'])
def google_logout():
    """
    Handles user logout by clearing the session.
    """
    # Clear the session
    session.clear()  # or you could use session.pop('user_id') if you want to be specific

    return jsonify({'message': 'Logout successful'}), 200   

@oauth_bp.route('/api/protected-route', methods=['GET'])
def protected_route():
    """
    Example of a protected route that checks user session.
    """
    if 'user_id' in session:
        return jsonify({
            'message': 'You are logged in',
            'user_id': session['user_id'],
            'email': session['email']
        }), 200
    else:
        return jsonify({'message': 'Not authenticated'}), 401
    
    