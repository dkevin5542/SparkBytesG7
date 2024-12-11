from flask import Blueprint, request, jsonify
from app.data.database import get_db_connection
from app.auth.token_utils import validate_token
import sqlite3

rsvp_bp = Blueprint('rsvp_bp', __name__)

# RSVP to event
@rsvp_bp.route('/api/rsvp', methods=['POST'])
def rsvp_event():
    """
    Submits an RSVP for a user to an event.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid or expired JWT token.'}), 401

    data = request.get_json()
    event_id = data.get('event_id')
    rsvp_status = data.get('rsvp_status')

    # Validate required fields
    if not event_id or not rsvp_status:
        return jsonify({'success': False, 'message': 'Event ID and RSVP status is required.'}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            

            # Check if the event exists
            cursor.execute("SELECT event_id FROM Event WHERE event_id = ?", (event_id,))
            event = cursor.fetchone()
            if not event:
                return jsonify({'success': False, 'message': 'Event not found.'}), 404

            # Check for duplicate RSVP
            cursor.execute(
                "SELECT * FROM RSVP WHERE user_id = ? AND event_id = ?", 
                (user_id, event_id)
            )
            existing_rsvp = cursor.fetchone()
            if existing_rsvp:
                return jsonify({'success': False, 'message': 'You have already RSVPed for this event.'}), 400

            # Insert new RSVP
            cursor.execute(
                """
                INSERT INTO RSVP (user_id, event_id, status)
                VALUES (?, ?, ?)
                """,
                (user_id, event_id, rsvp_status)
            )
            conn.commit()

        return jsonify({'success': True, 'message': 'RSVP successful'}), 201
    
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to RSVP', 'details': str(e)}), 500
    
@rsvp_bp.route('/api/user_rsvps', methods=['GET'])
def get_user_rsvps():
    """
    Retrieves all events a user has RSVP'd to, including their RSVP status.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Query to retrieve events RSVP'd by the user
            query = """
                SELECT e.event_id, e.title, e.description, e.event_date, e.start_time, e.end_time,
                       e.location, e.address, e.quantity, r.status
                FROM RSVP r
                JOIN Event e ON r.event_id = e.event_id
                WHERE r.user_id = ?
            """
            cursor.execute(query, (user_id,))
            rsvps = cursor.fetchall()

            if not rsvps:
                return jsonify({'success': False, 'message': 'No RSVP events found for this user.'}), 404

            # Format the results
            formatted_rsvps = [
                {
                    "event_id": row["event_id"],
                    "title": row["title"],
                    "description": row["description"],
                    "event_date": row["event_date"],
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                    "location": row["location"],
                    "address": row["address"],
                    "quantity": row["quantity"],
                    "status": row["status"]
                }
                for row in rsvps
            ]

        return jsonify({"success": True, "events": formatted_rsvps}), 200

    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to retrieve RSVP events.', 'details': str(e)}), 500

@rsvp_bp.route('/api/event_rsvps/<int:event_id>', methods=['GET'])
def get_event_rsvps(event_id):
    """
    Retrieves a list of all users who RSVP'd to a specific event.

        Parameters:
        event_id (int): The ID of the event.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Query to retrieve users who RSVP'd for the event
            query = """
                SELECT u.user_id, u.name, u.email, u.bio, u.interests, u.language, r.status
                FROM RSVP r
                JOIN User u ON r.user_id = u.user_id
                WHERE r.event_id = ?
            """
            cursor.execute(query, (event_id,))
            rsvps = cursor.fetchall()

            if not rsvps:
                return jsonify({'success': False, 'message': 'No RSVPs found for this event.'}), 404

            # Format the results
            formatted_rsvps = [
                {
                    "user_id": row["user_id"],
                    "name": row["name"],
                    "email": row["email"],
                    "bio": row["bio"],
                    "interests": row["interests"],
                    "language": row["language"],
                    "status": row["status"]
                }
                for row in rsvps
            ]

        return jsonify({"success": True, "users": formatted_rsvps}), 200

    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to retrieve RSVPs.', 'details': str(e)}), 500
