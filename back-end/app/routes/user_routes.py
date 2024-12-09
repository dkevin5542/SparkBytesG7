from flask import Blueprint, request, jsonify
from app.data.database import get_db_connection
from app.auth import validate_token
import sqlite3

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/auth/profile_status', methods=['GET'])
def profile_status():
    """
    Check if the user has an existing profile (meaning bio, interests, dietary preferences, etc. are filled out) in order to determine whether to edit or create a new profile for the user.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid token'}), 401

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Check User table fields
            cursor.execute("SELECT interests, language FROM User WHERE user_id = ?", (user_id,))
            user = cursor.fetchone()

            if not user or not user['interests'] or not user['language']:
                return jsonify({'profile_complete': False}), 200

            # Check dietary preferences
            cursor.execute("SELECT COUNT(*) AS diet_count FROM UserFoodTypes WHERE user_id = ?", (user_id,))
            diet_count = cursor.fetchone()['diet_count']

            if diet_count == 0:
                return jsonify({'profile_complete': False}), 200

            return jsonify({'profile_complete': True}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': 'An error occurred', 'details': str(e)}), 500

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

    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    data = request.get_json()
    print(data)
    
    # Retrieve name, bio, and interests from the request
    name = data.get('name')
    bio = data.get('bio')
    interests = data.get('interests')
    bu_id = data.get('buID')
    diet = data.get('diet', [])
    language = data.get('language')

    # Validate input data
    if not isinstance(name, str) or not name.strip():
        return jsonify({'success': False, 'message': 'Invalid name'}), 400

    if bio is not None and not isinstance(bio, str):
        return jsonify({'success': False, 'message': 'Invalid bio'}), 400

    if interests is not None and not isinstance(interests, str):
        return jsonify({'success': False, 'message': 'Invalid interests'}), 400

    if not isinstance(bu_id, str) or not bu_id.strip():
        return jsonify({'success': False, 'message': 'Invalid BU ID'}), 400

    if diet is not None and not isinstance(diet, list):
        return jsonify({'success': False, 'message': 'Invalid diet'}), 400

    if language is not None and not isinstance(language, str):
        return jsonify({'success': False, 'message': 'Invalid language'}), 400

    try:
        # Update the user's profile in the database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE User
                SET name = ?, bio = ?, interests = ?, bu_id = ?, preferred_language = ?
                WHERE user_id = ?
                """,
                (name, bio, interests, bu_id, language, user_id)
            )
            user_id = cursor.lastrowid

            for food_type in diet:
                cursor.execute(
                    """
                    INSERT INTO UserFoodTypes (user_id, food_type_id)
                    SELECT ?, food_type_id FROM FoodTypes WHERE food_type_name = ?
                    """,
                    (user_id, food_type)
                )
            conn.commit()

        # Check if the update was successful
        if cursor.rowcount > 0:
            return jsonify({'success': True, 'message': 'Profile created successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'No profile was updated. User not found.'}), 404

    except Exception as e:
        print(f"Error occurred during profile creation: {e}")  # Log the error
        return jsonify({'success': False, 'message': 'An error occurred', 'details': str(e)}), 500
  
@user_bp.route('/api/get_profile', methods=['GET'])
def get_profile():
    """
    Fetch the user's profile information.
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

            # Fetch basic user profile info
            cursor.execute(
                """
                SELECT name, bio, interests, bu_id, language
                FROM User
                WHERE user_id = ?
                """,
                (user_id,)
            )
            user = cursor.fetchone()

            if not user:
                return jsonify({'message': 'User not found'}), 404

            # Fetch user dietary preferences
            cursor.execute(
                """
                SELECT ft.food_type_name
                FROM UserFoodTypes uft
                JOIN FoodTypes ft ON uft.food_type_id = ft.food_type_id
                WHERE uft.user_id = ?
                """,
                (user_id,)
            )
            food_preferences = [row[0] for row in cursor.fetchall()]

            # Map the data to a dictionary
            user_profile = {
                'name': user[0],
                'bio': user[1],
                'interests': user[2],
                'buID': user[3],
                'language': user[4],
                'dietary_preferences': food_preferences,
            }
            return jsonify(user_profile), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'details': str(e)}), 500
    
@user_bp.route('/api/edit_profile', methods=['PUT'])
def edit_profile():
    """
    Update the user's profile information, including dietary preferences.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)
    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid or expired JWT token.'}), 401

    # Get the updated profile data from the request body
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Request body is missing or invalid.'}), 400

    name = data.get('name')
    bio = data.get('bio', '')
    interests = data.get('interests', '')
    language = data.get('language', 'English')
    dietary_preferences = data.get('diet', [])  # List of dietary preferences

    # Validate required fields
    if not name:
        return jsonify({'success': False, 'message': 'Name is required.'}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Update the user's profile information
            cursor.execute(
                """
                UPDATE User
                SET name = ?, bio = ?, interests = ?, language = ?
                WHERE user_id = ?
                """,
                (name, bio, interests, language, user_id)
            )

            # Clear existing dietary preferences for the user
            cursor.execute(
                """
                DELETE FROM UserFoodTypes
                WHERE user_id = ?
                """,
                (user_id,)
            )

            # Insert updated dietary preferences
            for preference in dietary_preferences:
                cursor.execute(
                    """
                    INSERT INTO UserFoodTypes (user_id, food_type_id)
                    SELECT ?, food_type_id FROM FoodTypes WHERE food_type_name = ?
                    """,
                    (user_id, preference)
                )

            conn.commit()

        return jsonify({'success': True, 'message': 'Profile updated successfully.'}), 200

    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to update profile.', 'details': str(e)}), 500


