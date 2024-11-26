from flask import Blueprint, request, jsonify, session
from database import get_db_connection
import sqlite3

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/users', methods=['GET'])
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
    
@user_bp.route('/api/update_preferences', methods=['PUT'])
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

@user_bp.route('/api/create_profile', methods=['POST'])
def create_profile():
    """
    Updates the user's profile information (name, bio, interests, BU ID, diet and language).
    Requires the user to be logged in (session should have user_id).
    """

    # Check if user is logged in
    user_id = session.get('user_id')
    print('user_id is ', user_id)

    if not user_id:
        return jsonify({'message': 'Unauthorized. Please log in.'}), 401

    data = request.get_json()
    print(data)
    
    # Retrieve name, bio, and interests from the request
    name = data.get('name')
    bio = data.get('bio')
    interests = data.get('interests')
    bu_id = data.get('buID')
    diet = data.get('diet')
    language = data.get('language')

    # Validate input data
    if not isinstance(name, str) or not name.strip():
        return jsonify({'message': 'Invalid name'}), 400

    if bio is not None and not isinstance(bio, str):
        return jsonify({'message': 'Invalid bio'}), 400

    if interests is not None and not isinstance(interests, str):
        return jsonify({'message': 'Invalid interests'}), 400

    if not isinstance(bu_id, str) or not bu_id.strip():
        return jsonify({'message': 'Invalid BU ID'}), 400

    if diet is not None and not isinstance(diet, str):
        return jsonify({'message': 'Invalid diet'}), 400

    if language is not None and not isinstance(language, str):
        return jsonify({'message': 'Invalid language'}), 400

    try:
        # Update the user's profile in the database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE User
                SET name = ?, bio = ?, interests = ?, bu_id = ?, diet = ?, preferred_language = ?
                WHERE user_id = ?
                """,
                (name, bio, interests, bu_id, diet, language, user_id)
            )
            conn.commit()

        return jsonify({'message': 'Profile created successfully'}), 200

    except Exception as e:
        print(f"Error occurred during profile creation: {e}")  # Log the error
        return jsonify({'message': 'An error occurred', 'details': str(e)}), 500
    
    
@user_bp.route('/api/get_profile', methods=['GET'])
def get_profile():
    """
    Fetch the user's profile information.
    Requires the user to be logged in (session should have user_id).
    """
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'Unauthorized. Please log in.'}), 401

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT name, bio, interests, bu_id, diet, preferred_language
                FROM User
                WHERE user_id = ?
                """,
                (user_id,)
            )
            user = cursor.fetchone()

            if not user:
                return jsonify({'message': 'User not found'}), 404

            # Map the data to a dictionary
            user_profile = {
                'name': user[0],
                'bio': user[1],
                'interests': user[2],
                'buID': user[3],
                'diet': user[4],
                'language': user[5],
            }
            return jsonify(user_profile), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'details': str(e)}), 500
