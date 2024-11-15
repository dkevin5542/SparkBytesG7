# app.py

"""
Flask Backend for Spark Bytes

This application provides a RESTful API for managing users, events, RSVPs, favorites, and reviews.
It integrates Google OAuth for user authentication.

Key Features:
- User Authentication via Google OAuth
- CRUD operations for events
- RSVP functionality for events
- Managing users' favorite events
- Submitting reviews for attended events
- Updating user preferences
"""

from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import sqlite3

# Google OAuth libraries
from google.oauth2 import id_token
from google.auth.transport import requests

# ENV management
from dotenv import load_dotenv
import os

# load .env variables
load_dotenv()

# Retrieve Google Client ID from environment variables
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

# Validate that GOOGLE_CLIENT_ID is properly set
if not GOOGLE_CLIENT_ID:
    raise ValueError("No GOOGLE_CLIENT_ID set for Flask application")

# Initialize Flask application and enable CORS
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
CORS(app, supports_credentials=True)

def get_db_connection():
    """
    get_db_connection() establishes a connection to the SQLite database.

    Returns:
        sqlite3.connection: Database connection object with rows returned as dictionaries.
    Raises:
        RuntimeError: If there's an error connecting to the database.
    """
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise RuntimeError(f"Database connection error: {e}")

@app.route('/api/users', methods=['GET'])
def get_users():
    """
    get_users() retrieves all users from the User table.

    Returns:
        Flask.Response: A JSON response containing the list of users or an error message.
    """
    try:
        conn = get_db_connection()
        users = conn.execute('SELECT * FROM User').fetchall()
        conn.close()
        user_list = [dict(row) for row in users]
        return jsonify(user_list), 200
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500

# CREATE Event
# Note: not fully implemented yet on frontend, so dummy values are used for missing input fields
@app.route('/api/events', methods=['POST'])
def create_event():
    """
    create_event() creates a new event in the Event table.

    Expected JSON Payload:
    {
        "title": "Event Title",
        "description": "Event Description",
        "date": "YYYY-MM-DD",
        "location": "Event Location",
        "user_id": Optional integer,
        "food_type": Optional string,
        "address": Optional string,
        "start_time": Optional string (HH:MM:SS),
        "end_time": Optional string (HH:MM:SS)
    }

    Returns:
        Flask.Response: JSON response indicating success with the new event ID or an error message.
    """
    data = request.get_json()
        
    # current fields
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')
    user_id = data.get('user_id', 1)
    food_type = data.get('food_type', 'Snacks')
    address = data.get('address', 'N/A')
    start_time = data.get('start_time', '00:00:00')
    end_time = data.get('end_time', '23:59:59')
    quantity = data.get('quantity', 0)
    event_type = data.get('event_type', 'Faculty')

        # insert to database
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO Event (user_id, title, description, food_type, location, address, event_date, start_time, end_time, quantity, event_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, title, description, food_type, location, address, event_date, start_time, end_time, quantity, event_type)
            )
            event_id = cursor.lastrowid

        return jsonify({'message': 'Event created successfully', 'event_id': event_id}), 201
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to create event', 'details': str(e)}), 500

# RETRIEVE all events
@app.route('/api/events', methods=['GET'])
def get_events():
    """
    get_events() retrieves all events from the Event table as a paginated list of events.

    Paramaters:
        Pagination
        page (int): The page number (default 1).
        per_page (int): The number of events per page (default 10).
        
        Sorting
        sort_by
        order

        Filtering
        keyword
        dietary_needs
        date
        start_time
        end_time

    Returns:
        Flask.Response: A JSON response containing the paginated list of events or an error message.
    """
    try:
        # pagination parameters 
        page = request.args.get('page', 1, type-int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        # sorting parameters
        sort_by = request.args.get('sort_by', 'date')  # Default sort by date
        order = request.args.get('order', 'asc').lower() # Default ascending

        # filtering parameters
        keyword = request.args.get('keyword')
        dietary_needs = request.args.get('dietary_needs')
        date = request.args.get('date')
        start_time = request.args.get('start_time')
        end_time = request.args.get('end_time')

        # Construct SQL query
        query = "SELECT * FROM Event WHERE 1=1"
        params = []

        # Add filters if provided

        if keyword:
            query += " AND (title LIKE ? OR description LIKE ?)"
            params.extend([f"%{keyword}%", f"%{keyword}%"])
        
        if dietary_needs:
            query += " AND food_type = ?"
            params.append(dietary_needs)
        
        if date:
            query += " AND event_date = ?"
            params.append(date)
        
        if start_time:
            query += " AND start_time >= ?"
            params.append(start_time)
        
        if end_time:
            query += " AND end_time <= ?"
            params.append(end_time)

        # Add sorting by date, location, title
        if sort_by in ["date", "location", "title"]:
            query += f" ORDER BY {sort_by} {'ASC' if order == 'asc' else 'DESC'}"

        # Add pagination
        query += " LIMIT ? OFFSET ?"
        params.extend([per_page, offset])

        with get_db_connection() as conn:
            cursor = conn.cursor
            cursor.execute(query, params)
            events = cursor.fetchall()

        event_list = [dict(row) for row in events]
        return jsonify({'page': page, 'per_page': per_page, 'total_events': len(event_list), 'events': event_list}), 200
    
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500

# RETRIEVE an event by ID
@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    get_event(event_id) retrieves an event from the Event table by specifying the event_id.

    Expected JSON Payload:
    {
        "event_id": Integer
    }

    Returns:
        Flask.Response: A JSON response containing the specified event or an error message.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Event WHERE event_id = ?", (event_id,))
            event = cursor.fetchone()

            if cursor is None:
                return jsonify({'error': 'Event not found'}), 404
        
            return jsonify(dict(event))
    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500
    
# UPDATE event
@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """
    update_event(event_id) will update the fields of the specified event.

    Expected JSON Payload:
    {
        "title": String,
        "description": String,
        "date": String,
        "event_id": Integer,
        "location": String,         
        "food_type": String,        
        "address": String,          
        "start_time": String,       # in HH:MM:SS format
        "end_time": String,         # in HH:MM:SS format
        "quantity": Integer,        
        "event_type": String  
    }
    
    Returns:
        Flask.Response: A JSON response containing a successful update message or an error.
    """
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')
    food_type = data.get('food_type')
    address = data.get('address')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    quantity = data.get('quantity')
    event_type = data.get('event_type')

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE Event
                SET title = COALESCE(?, title),
                    description = COALESCE(?, description),
                    event_date = COALESCE(?, event_date),
                    location = COALESCE(?, location),
                    food_type = COALESCE(?, food_type),
                    address = COALESCE(?, address),
                    start_time = COALESCE(?, start_time),
                    end_time = COALESCE(?, end_time),
                    quantity = COALESCE(?, quantity),
                    event_type = COALESCE(?, event_type),
                    updated_at = CURRENT_TIMESTAMP
                WHERE event_id = ?
                """,
                (title, description, event_date, location, food_type, address, start_time, end_time, quantity, event_type, event_id))

            if cursor.rowcount == 0:
                return jsonify({'error': 'Event not found'}), 404
            
            return jsonify({'message': 'Event updated successfully'}), 200
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500
        
# DELETE event
@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def del_event(event_id):
    """
    del_event(event_id) will delete the specified event.

    Returns:
        Flask.Response: A JSON response containing a successful deletion message or an error.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM Event WHERE event_id = ?', (event_id,))
            if cursor.rowcount == 0:
                return jsonify({'error': 'Event not found'}), 404
            return jsonify({'message': 'Event deleted successfully'}), 200
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error occurred', 'details': str(e)}), 500

# RSVP to event
@app.route('/api/rsvp', methods=['POST'])
def rsvp_event():
    """
    Submits an RSVP for a user to an event.

    Expected JSON Payload:
    {
        "user_id": Integer,
        "event_id": Integer,
        "rsvp_status": Optional string ("Going", "Interested", "Not Going")
    }

    Returns:
        Flask.Response: JSON response indicating successful RSVP or an error message.
    """
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
    """
    Adds an event to a user's favorites.

    Expected JSON Payload:
    {
        "user_id": Integer,
        "event_id": Integer
    }

    Returns:
        Flask.Response: JSON response indicating successful favorite or an error message.
    """
    data = request.get_json()
    user_id = data.get('user_id')
    event_id = data.get('event_id')

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO Favorite (user_id, event_id)
                VALUES (?, ?)
                """,
                (user_id, event_id)
            )
            conn.commit()

        return jsonify({'message': 'Event added to bookmarks'}), 201
    
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to add favorite', 'details': str(e)}), 500

@app.route('/api/favorites/<int:user_id>', methods=["GET"])
def user_favorites(user_id):
    """
    user_favorites(user_id) retrieves a list of a specified user's favorited events by user_id.

    Expected JSON Payload:
    {
        "user_id": Integer
    }

    Returns:
        Flask.Response: A JSON response containing the list of specified events or an error message.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT Event.event_id, Event.title, Event.date, Event.location FROM Favorite JOIN Event ON Favorite.event_id = Event.event_id WHERE Favorite.user_id = ?", (user_id,))
            events = cursor.fetchall()

            if not events:
                return jsonify({'error', 'No favorites found for this user'}), 404
            
            events_list = [{'event_id': row[0], 'title': row[1], 'date': row[2], 'location': row[3]} for row in events]
            return jsonify(events_list)
        
    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

@app.route('/api/review', methods=['POST'])
def give_feedback():
    """
    Submits a review for an event.

    Expected JSON Payload:
    {
        "user_id": Integer,
        "event_id": Integer,
        "rating": Integer (1-5),
        "comment": Optional string
    }

    Returns:
        Flask.Response: JSON response indicating successful review or an error message.
    """
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

# ISSUE
@app.route('/api/google-login', methods=['POST'])
def google_login():
    """
    Handles Google OAuth login. Only @bu.edu domains will be allowed to log into the service.

    Expected JSON Payload:
    {
        "token": "Google ID Token"
    }

    Returns:
        Flask.Response: JSON response containing user details or an error message.
    """
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

        # Validate that the email ends with '@bu.edu'
        if not email.lower().endswith('@bu.edu'):
            return jsonify({'message': 'Unauthorized domain, only @bu.edu emails are allowed.'}), 403

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
                user_id = user['user_id']
        
        session['user_id'] = user_id
        session.modified = True
        print("Stored user_id in session:", session['user_id'])
        
        return jsonify({
            'message': 'Login successful',
            'user_id': user_id,
            'email': email
        }), 200

    except ValueError:
        return jsonify({'message': 'Invalid token'}), 401
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error occurred', 'details': str(e)}), 500

@app.route('/api/<int:user_id>/user-info', methods=['GET'])
def get_user_info(user_id):
    """
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM User WHERE user_id = ?", (user_id,))
            result = cursor.fetchone()
            if result:
                return jsonify(result)
            else:
                return jsonify({'error': 'User not found'}), 404
    except sqlite3.Error as e:
        return jsonify({'error': 'Database error occurred', 'details': str(e)}), 500

@app.route('/api/create-profile', methods=['POST'])
def create_profile():
    """
    """
    user_id = session.get('user_id')
    print("User ID from session:", user_id)

    data = request.get_json()
    print("Received data:", data)
    name = data.get('name')
    bio = data.get('bio')
    interests = data.get('interests')
    print(name)
    print(bio)
    print(interests)
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE User
                SET name = ?, bio = ?, interests = ?
                WHERE user_id = ?
            """, (name, bio, interests, user_id))
            conn.commit()

        return jsonify({'message': 'Profile created successfully'}), 201
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to create profile', 'details': str(e)}), 500

    
@app.route('/api/update_preferences', methods=['PUT'])
def update_preferences():
    """
    Updates user preferences such as diet and preferred language.

    Expected JSON Payload:
    {
        "diet": "Vegetarian" | "Vegan" | "Omnivore" | "Pescatarian" | "Other",
        "preferred_language": "English" | "Mandarin" | "Arabic" | "Spanish",
        "user_id": Integer
    }

    Returns:
        Flask.Response: JSON response indicating successful preference update or an error message.
    """
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

@app.route('/api/data', methods=['GET'])
def get_data():
    """
    A test endpoint to verify that the API is working correctly.

    Returns:
        Flask.Response: JSON response with a dummy message and items.
    """
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

# test session info
@app.route('/session-info')
def session_info():
    return jsonify(dict(session))

@app.route('/set-session')
def set_session():
    session['user_id'] = 123  # Set a dummy user ID
    return 'Session set!'

@app.route('/get-session')
def get_session():
    return f"user_id in session is: {session.get('user_id')}"

if __name__ == '__main__':
    app.run(host="localhost", port=5002, debug=True)