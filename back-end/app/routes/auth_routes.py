from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.auth.token_utils import generate_token
from database import get_db_connection
import sqlite3

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registers a user. Only @bu.edu email domains are allowed.
    """
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    bu_id = data.get('bu_id')
    name = data.get('name')

    if not data or not password or not email or not bu_id or not name:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    if not email.endswith('@bu.edu'):
         return jsonify({'success': False, 'message': 'Only @bu.edu email domains are allowed'}), 400

    password_hash = generate_password_hash(password)

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO User (email, password_hash, bu_id, name) VALUES (?, ?, ?, ?)", 
                        (email, password_hash, bu_id, name))
            conn.commit()

    except sqlite3.IntegrityError as e:
        # Handle unique constraint violations (e.g., duplicate email or BU ID)
        if "UNIQUE constraint" in str(e):
            return jsonify({'success': False, 'message': 'Email or BU ID already exists'}), 400
        return jsonify({'success': False, 'message': 'Database error', 'details': str(e)}), 500

    return jsonify({'success': True, 'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Handles login using email.
    """
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

    email = data.get('email')
    password = data.get('password')
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT user_id, password_hash FROM User where email = ?", (email,))
            result = cursor.fetchone()

            if result is None:
                 return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
            
            user_id, password_hash = result

            if not check_password_hash(password_hash, password):
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

            # If login is successful, create and return a JWT.
            token = generate_token(user_id=user_id)

            return jsonify({'success': True, 'message': 'Login successful', 'token': token}), 200
        
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to login', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': 'An unexpected error occurred', 'details': str(e)}), 500
