# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

# google oauth
from google.oauth2 import id_token
from google.auth.transport import requests

from dotenv import load_dotenv
import os

# load .env variables
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

if not GOOGLE_CLIENT_ID:
    raise ValueError("No GOOGLE_CLIENT_ID set for Flask application")

app = Flask(__name__)
CORS(app)

# get connection
def get_db_connection():
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise RuntimeError(f"Database connection error: {e}")

# retrieve users
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        users = conn.execute('SELECT * FROM User').fetchall()
        conn.close()
        user_list = [dict(row) for row in users]
        return jsonify(user_list), 200
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500

# retrieve events
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        events = conn.execute('SELECT * FROM Event').fetchall()
        conn.close()
        event_list = [dict(row) for row in events]
        return jsonify(event_list), 200
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500

# create event (wip)
@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        
        # current fields
        title = data.get('title')
        description = data.get('description')
        event_date = data.get('date')
        location = data.get('location')

        if not title or not description or not event_date or not location:
            return jsonify({'error': 'Missing required fields'}), 400

        # unimplemented fields with default values
        user_id = data.get('user_id', 1)
        food_type = data.get('food_type', 'Snacks')
        address = data.get('address', 'N/A')
        start_time = data.get('start_time', '00:00:00')
        end_time = data.get('end_time', '23:59:59')

        # insert to database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Event (user_id, title, description, food_type, location, address, event_date, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, title, description, food_type, location, address, event_date, start_time, end_time)
        )
        conn.commit()
        event_id = cursor.lastrowid
        conn.close()

        return jsonify({'message': 'Event created successfully', 'event_id': event_id}), 201
    except sqlite3.Error as e:
            return jsonify({'error': 'Failed to create event', 'details': str(e)}), 500

# RSVP to event
@app.route('/api/rsvp', methods=['POST'])
def rsvp_event():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')
    rsvp_status = data.get('rsvp_status', 'Yes')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO RSVP (user_id, event_id, rsvp_status)
            VALUES (?, ?, ?)
            """,
            (user_id, event_id, rsvp_status)
        )
        conn.commit()
        conn.close()

        return jsonify({'message': 'RSVP successful'}), 201
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to RSVP', 'details': str(e)}), 500

# Favorite event
@app.route('/api/favorites', methods=['POST'])
def favorite_event():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Favorite (user_id, event_id)
            VALUES (?, ?)
            """,
            (user_id, event_id)
        )
        conn.commit()
        conn.close()

        return jsonify({'message': 'Event added to bookmarks'}), 201
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to add favorite', 'details': str(e)}), 500

# Provide review for an event
@app.route('/api/review', methods=['POST'])
def give_feedback():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not user_id or not event_id or rating is None:
        return jsonify({'error': 'Missing required fields: user_id, event_id, or rating'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Review (user_id, event_id, rating, comment)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, event_id, rating, comment)
        )
        conn.commit()
        conn.close()

        return jsonify({'message': 'Feedback submitted'}), 201
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to submit feedback', 'details': str(e)}), 500

# Google login
@app.route('/api/google-login', methods=['POST'])
def google_login():
    # Get the token from the frontend
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'message': 'Token is missing'}), 400

    try:
        # Verify the token with Google's OAuth2 API
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Check if the token is issued by Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify({'message': 'Wrong issuer.'}), 401

        # Token is valid; extract user information
        google_user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', 'Anonymous')

        # Check if user exists, if not, create a new user
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM User WHERE google_id = ?", (google_user_id,))
            user = cursor.fetchone()

            if not user:
                cursor.execute(
                    """
                    INSERT INTO User (google_id, email, diet, preferred_language, role)
                    VALUES (?, ?, 'Omnivore', 'English', 'Student')
                    """,
                    (google_user_id, email)
                )
                conn.commit()
                user_id = cursor.lastrowid
            else:
                user_id = user['id']

        return jsonify({
            'message': 'Login successful',
            'user_id': user_id,
            'email': email
        }), 200

    except ValueError:
        return jsonify({'message': 'Invalid token'}), 401
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error occurred', 'details': str(e)}), 500

# Route to update user preferences
@app.route('/api/update_preferences', methods=['PUT'])
def update_preferences():
    try:
        data = request.get_json()
        diet = data.get('diet')
        preferred_language = data.get('preferred_language')
        
        if not diet or not preferred_language:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update user preferences
        cursor.execute(
            "UPDATE User SET diet = ?, preferred_language = ? WHERE user_id = ?",
            (diet, preferred_language, request.user_id)
        )
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "User preferences updated successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": "Database error occurred", "details": str(e)}), 500

# test for working api
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5002)