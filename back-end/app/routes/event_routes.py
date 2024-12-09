from flask import Blueprint, request, jsonify
from app.data.database import get_db_connection
from app.auth.token_utils import validate_token
from datetime import datetime
import sqlite3

event_bp = Blueprint('event_bp', __name__)

# CREATE event
@event_bp.route('/api/events', methods=['POST'])
def create_event():
    """
    create_event() creates a new event in the Event table.

    Expected JSON Payload:
    {
        "title": "Event Title",
        "description": "Event Description",
        "date": "YYYY-MM-DD",
        "location": "Event Location",
        "user_id": string,
        "food_types": list of strings,
        "address": string,
        "start_time": string (HH:MM:SS),
        "end_time": string (HH:MM:SS)
        "quantity": integer
    }

    Returns:
        Flask.Response: JSON response indicating success with the new event ID or an error message.
    """
    # Extract token from cookie
    token = request.cookies.get('token')

    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Validate the token and extract the user ID
    user_id = validate_token(token)

    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid or expired JWT token.'}), 401

    # Get JSON payload
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')
    address = data.get('address', 'N/A')
    food_types = data.get('food_types', [])
    quantity = data.get('quantity', 0)
    start_time = data.get('start_time', '12:00:00 PM')
    end_time = data.get('end_time', '11:59:59 PM')

    # Validate required fields
    if not title or not description or not event_date or not location or not address or not food_types or not quantity or not start_time or not end_time:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400


    try:
        # Validate that event date is in the future
        event_date_obj = datetime.strptime(event_date, "%Y-%m-%d")  # Parse the date
        current_date = datetime.now()

        if event_date_obj <= current_date:
            return jsonify({'success': False, 'message': 'The event date must be in the future.'}), 400
        
        # Validate that start time is before the end time
        start_time_obj = datetime.strptime(start_time, "%H:%M:%S")
        end_time_obj = datetime.strptime(end_time, "%H:%M:%S")

        if end_time_obj <= start_time_obj:
            return jsonify({'success': False, 'message': 'The end time must be after the start time.'}), 400
        
    except ValueError as e:
        return jsonify({'success': False, 'message': f'Invalid date or time format: {e}'}), 400

    # Insert to database
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Insert event into Event table
            cursor.execute(
                """
                INSERT INTO Event (user_id, title, description, location, address, event_date, start_time, end_time, quantity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, title, description, location, address, event_date, start_time, end_time, quantity)
            )
            event_id = cursor.lastrowid

            for food_type in food_types:
                cursor.execute(
                    """
                    INSERT INTO EventFoodTypes (event_id, food_type_id)
                    SELECT ?, food_type_id FROM FoodTypes WHERE food_type_name = ?
                    """,
                    (event_id, food_type)
                )

        return jsonify({'message': 'Event created successfully', 'event_id': event_id}), 201
    
    except sqlite3.Error as e:
        return jsonify({'error': 'Failed to create event', 'details': str(e)}), 500

# RETRIEVE all events
@event_bp.route('/api/getevents', methods=['GET'])
def get_events():
    """
    get_events() retrieves all events from the Event table as a paginated list of events.

    Paramaters:
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
    # Extract query parameters
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    sort_by = request.args.get('sort_by', 'event_date')  # Default to sorting by date
    order = request.args.get('order', 'asc').lower()
    keyword = request.args.get('keyword', '').strip()
    dietary_needs = request.args.getlist('dietary_needs')
    date = request.args.get('date')
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')

    # Validate sorting order
    if order not in ['asc', 'desc']:
        order = 'asc'

    # Base query
    query = """
        SELECT e.event_id, e.title, e.description, e.event_date, e.start_time, e.end_time,
               e.location, e.address, e.quantity, GROUP_CONCAT(ft.food_type_name) AS dietary_needs
        FROM Event e
        LEFT JOIN EventFoodTypes eft ON e.event_id = eft.event_id
        LEFT JOIN FoodTypes ft ON eft.food_type_id = ft.food_type_id
        WHERE 1=1
    """
    params = []

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
                    "dietary_needs": row["dietary_needs"].split(",") if row["dietary_needs"] else []
                }
                for row in events
            ]

        return jsonify({"success": True, "events": formatted_events}), 200

    except sqlite3.Error as e:
        return jsonify({"success": False, "message": "Failed to retrieve events.", "details": str(e)}), 500

# RETRIEVE an event by ID
@event_bp.route('/api/events/<int:event_id>', methods=['GET'])
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
@event_bp.route('/api/events/<int:event_id>', methods=['PUT'])
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
@event_bp.route('/api/events/<int:event_id>', methods=['DELETE'])
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
    

@event_bp.route('/api/user_events', methods=['GET'])
def get_user_events():
    """
    Retrieve all events created by the currently logged-in user.
    """
    # Extract token from cookie
    token = request.cookies.get('token')
    if not token:
        return jsonify({'success': False, 'message': 'Authorization token is missing.'}), 401

    # Validate token and extract user ID
    user_id = validate_token(token)
    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid or expired token.'}), 401

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT e.event_id, e.title, e.description, e.event_date, e.start_time, e.end_time,
                       e.location, e.address, e.quantity, GROUP_CONCAT(ft.food_type_name) AS dietary_needs
                FROM Event e
                LEFT JOIN EventFoodTypes eft ON e.event_id = eft.event_id
                LEFT JOIN FoodTypes ft ON eft.food_type_id = ft.food_type_id
                WHERE e.user_id = ?
                GROUP BY e.event_id
                """,
                (user_id,)
            )
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
                    "dietary_needs": row["dietary_needs"].split(",") if row["dietary_needs"] else []
                }
                for row in events
            ]

        return jsonify({"success": True, "events": formatted_events}), 200

    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': 'Failed to retrieve events.', 'details': str(e)}), 500

