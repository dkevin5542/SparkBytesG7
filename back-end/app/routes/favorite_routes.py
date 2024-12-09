from flask import Blueprint, request, jsonify
from app.data.database import get_db_connection
from app.auth import validate_token
import sqlite3

fav_bp = Blueprint('fav_bp', __name__)

# Favorite an event
@fav_bp.route('/api/favorites', methods=['POST'])
def favorite_event():
    """
    Adds an event to a user's favorites.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    # Parse request data to get event_id
    data = request.get_json()

    if not data or 'event_id' not in data:
        return jsonify({'success': False, 'message': 'Event ID is required.'}), 400

    event_id = data['event_id']

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Check if the event exists
            cursor.execute(
                """
                SELECT event_id FROM Event WHERE event_id = ?
                """,
                (event_id,)
            )
            event = cursor.fetchone()

            if not event:
                return jsonify({'success': False, 'message': 'Event does not exist.'}), 404

            # Check if the favorite already exists
            cursor.execute(
                """
                SELECT * FROM Favorite WHERE user_id = ? AND event_id = ?
                """,
                (user_id, event_id)
            )
            existing_favorite = cursor.fetchone()

            if existing_favorite:
                return jsonify({'success': False, 'message': 'Event is already in favorites.'}), 400

            # Insert the favorite record
            cursor.execute(
                """
                INSERT INTO Favorite (user_id, event_id)
                VALUES (?, ?)
                """,
                (user_id, event_id)
            )
            conn.commit()

        return jsonify({'success': True, 'message': 'Event added to favorites.'}), 201

    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to add favorite.', 'details': str(e)}), 500

# RETRIEVE all favorite events for specified user
@fav_bp.route('/favorites', methods=["GET"])
def user_favorites():
    """
    user_favorites() retrieves a paginated, filtered, and sorted list of a user's favorited events.

    Parameters:
        Pagination
        page (int): The page number (default 1).
        per_page (int): The number of events per page (default 10).

        Sorting
        sort_by (str): The column to sort by (e.g., 'event_date', 'start_time').
        order (str): The sort order ('asc' or 'desc', default 'asc').

        Filtering
        keyword (str): A keyword to search for in the title or description.
        dietary_needs (list): List of dietary needs to filter by (e.g., ['Vegan', 'Gluten-Free']).
        date (str): Filter by a specific date (format: YYYY-MM-DD).
        start_time (str): Filter by events starting after this time (format: HH:MM:SS).
        end_time (str): Filter by events ending before this time (format: HH:MM:SS).
    """

    # Extract token from cookie
    token = request.cookies.get("token")

    if not token:
        return jsonify({"success": False, "message": "Authorization token is missing or invalid."}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    # Extract query parameters
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    sort_by = request.args.get("sort_by", "event_date")
    order = request.args.get("order", "asc").lower()
    keyword = request.args.get("keyword", "").strip()
    dietary_needs = request.args.getlist("dietary_needs")
    date = request.args.get("date")
    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")

    # Validate sorting order
    if order not in ["asc", "desc"]:
        order = "asc"

    # Base query for favorited events
    query = """
        SELECT e.event_id, e.title, e.description, e.event_date, e.start_time, e.end_time,
               e.location, e.address, e.quantity, GROUP_CONCAT(ft.food_type_name) AS dietary_needs
        FROM Favorite f
        JOIN Event e ON f.event_id = e.event_id
        LEFT JOIN EventFoodTypes eft ON e.event_id = eft.event_id
        LEFT JOIN FoodTypes ft ON eft.food_type_id = ft.food_type_id
        WHERE f.user_id = ?
    """
    params = [user_id]

    # Add filtering conditions
    if keyword:
        query += " AND (e.title LIKE ? OR e.description LIKE ?)"
        params.extend([f"%{keyword}%", f"%{keyword}%"])

    if dietary_needs:
        query += " AND e.event_id IN ("
        query += """
            SELECT DISTINCT eft.event_id
            FROM EventFoodTypes eft
            JOIN FoodTypes ft ON eft.food_type_id = ft.food_type_id
            WHERE ft.food_type_name IN ({})
        """.format(",".join("?" for _ in dietary_needs))
        query += ")"
        params.extend(dietary_needs)

    if date:
        query += " AND e.event_date = ?"
        params.append(date)

    if start_time:
        query += " AND e.start_time >= ?"
        params.append(start_time)

    if end_time:
        query += " AND e.end_time <= ?"
        params.append(end_time)

    # Add sorting
    query += f" GROUP BY e.event_id ORDER BY {sort_by} {order}"

    # Add pagination
    offset = (page - 1) * per_page
    query += " LIMIT ? OFFSET ?"
    params.extend([per_page, offset])

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            events = cursor.fetchall()

            # Format the results
            formatted_events = [
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
                    "dietary_needs": row["dietary_needs"].split(",") if row["dietary_needs"] else [],
                }
                for row in events
            ]

        return jsonify({"success": True, "events": formatted_events}), 200

    except sqlite3.Error as e:
        return jsonify({"success": False, "message": "Failed to retrieve favorited events.", "details": str(e)}), 500
