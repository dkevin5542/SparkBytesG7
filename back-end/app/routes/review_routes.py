from flask import Blueprint, request, jsonify
from app.data.database import get_db_connection
import sqlite3

review_bp = Blueprint('review_bp', __name__)

@review_bp.route('/api/review', methods=['POST'])
def give_feedback():
    """
    Submits a review for an event.
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
