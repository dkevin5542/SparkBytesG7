# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

#google oauth
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)
CORS(app)

GOOGLE_CLIENT_ID = '321219727339-nkudni5e54m7sjbtec1433ofod519f1r.apps.googleusercontent.com'

# get connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# retrieve users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM User').fetchall()
    conn.close()
    user_list = [dict(row) for row in users]
    return jsonify(user_list)

# retrieve events
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM Event').fetchall()
    conn.close()
    event_list = [dict(row) for row in events]
    return jsonify(event_list)

# create event (wip)
@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    
    # current fields
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')

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

# RSVP to event
@app.route('/api/rsvp', methods=['POST'])
def rsvp_event():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')
    rsvp_status = data.get('rsvp_status', 'Yes')

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

# Favorite event
@app.route('/api/favorites', methods=['POST'])
def favorite_event():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')

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

# Provide review for an event
@app.route('/api/review', methods=['POST'])
def give_feedback():
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')
    rating = data.get('rating')
    comment = data.get('comment', '')

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

# Google login
@app.route('/api/google-login', methods=['POST'])
def google_login():
    # Get the token from the frontend
    data = request.get_json()
    token = data.get('token')

    try:
        # Verify the token with Google's OAuth2 API
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Check if the token is issued by Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return jsonify({'message': 'Wrong issuer.'}), 401

        # Token is valid; extract user information
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', 'Anonymous')

        # Check if user exists, if not, create a new user
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM User WHERE google_id = ?", (user_id,))
        user = cursor.fetchone()

        if not user:
            cursor.execute(
                """
                INSERT INTO User (email, diet, preferred_language, role)
                VALUES (?, 'Omnivore', 'English', 'Student')
                """,
                (email,)
            )
            conn.commit()
            user_id = cursor.lastrowid
        else:
            user_id = user['id']

        conn.close()

        return jsonify({
            'message': 'Login successful',
            'user_id': user_id,
            'email': email
        }), 200

    except ValueError:
        return jsonify({'message': 'Invalid token'}), 401

# test for working api
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)