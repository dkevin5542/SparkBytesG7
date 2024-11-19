from flask import Blueprint, request, jsonify
from database import get_db_connection
import sqlite3

review_blueprint = Blueprint('review_bp', __name__)

@review_blueprint.route('/api/review', methods=['POST'])
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