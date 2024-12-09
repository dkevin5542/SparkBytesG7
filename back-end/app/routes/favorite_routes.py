from flask import Blueprint, request, jsonify
from ..database import get_db_connection
import sqlite3

fav_bp = Blueprint('fav_bp', __name__)

# Favorite an event
@fav_bp.route('/api/favorites', methods=['POST'])
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

# RETRIEVE all favorite events for specified user id
@fav_bp.route('/api/favorites/<int:user_id>', methods=["GET"])
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
