from flask import Blueprint, request, jsonify
from database import get_db_connection
from app.auth.token_utils import validate_token
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

    # Extract token from Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'success': False, 'message': 'Authorization token is missing or invalid.'}), 401

    # Extract user ID from token
    token = auth_header.split(" ")[1]
    user_id = validate_token(token)
    if not user_id:
        return jsonify({'success': False, 'message': 'Invalid or expired JWT token.'}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')
    address = data.get('address', 'N/A')
    food_types = data.get('food_types', [])
    quantity = data.get('quantity', 0)
    start_time = data.get('start_time', '00:00:00')
    end_time = data.get('end_time', '23:59:59')

    # Validate required fields
    if not title or not description or not event_date or not location or not address or not food_types or not quantity or not start_time or not end_time:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

    # Insert to database
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Insert event into Event table
            cursor.execute(
                """
                INSERT INTO Event (user_id, title, description, location, address, event_date, start_time, end_time, quantity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        page = request.args.get('page', 1, type=int)
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
        query = """
            SELECT e.event_id, e.title, e.description, e.event_date, e.location, e.event_type,
                   GROUP_CONCAT(f.food_type_name, ', ') AS food_types
            FROM Event e
            LEFT JOIN EventFoodTypes ef ON e.event_id = ef.event_id
            LEFT JOIN FoodTypes f ON ef.food_type_id = f.food_type_id
            WHERE 1=1
            """
        params = []

        # Add filters if provided

        if keyword:
            query += " AND (title LIKE ? OR description LIKE ?)"
            params.extend([f"%{keyword}%", f"%{keyword}%"])
        
        if dietary_needs:
            query += """
                AND e.event_id IN (
                    SELECT ef.event_id
                    FROM EventFoodTypes ef
                    JOIN FoodTypes f ON ef.food_type_id = f.food_type_id
                    WHERE f.food_type_name = ?
                )
                """
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
        if sort_by in ["event_date", "location", "title"]:
            query += f" ORDER BY {sort_by} {'ASC' if order == 'asc' else 'DESC'}"

        # Add pagination
        query += " LIMIT ? OFFSET ?"
        params.extend([per_page, offset])

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            events = cursor.fetchall()

        event_list = [dict(row) for row in events]
        
        return jsonify({'page': page, 'per_page': per_page, 'total_events': len(event_list), 'events': event_list}), 200
    except sqlite3.Error as e:
        return jsonify({'error':'Database error occurred', 'details': str(e)}), 500

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
