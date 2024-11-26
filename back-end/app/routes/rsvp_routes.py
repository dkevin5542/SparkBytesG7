from flask import Blueprint, request, jsonify
from database import get_db_connection
import sqlite3

rsvp_bp = Blueprint('rsvp_bp', __name__)

# RSVP to event
@rsvp_bp.route('/api/rsvp', methods=['POST'])
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
