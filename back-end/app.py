# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# get connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# retrieve users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM User').fetchall()
    conn.close()
    user_list = [dict(row) for row in users]
    return jsonify(user_list)

# retrieve events
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM Event').fetchall()
    conn.close()
    event_list = [dict(row) for row in events]
    return jsonify(event_list)

# create event (wip)
@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    
    # current fields
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('date')
    location = data.get('location')

    # unimplemented fields with default values
    user_id = data.get('user_id', 1)
    food_type = data.get('food_type', 'Snacks')
    address = data.get('address', 'N/A')
    start_time = data.get('start_time', '00:00:00')
    end_time = data.get('end_time', '23:59:59')

    # insert to database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO Event (user_id, title, description, food_type, location, address, event_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, title, description, food_type, location, address, event_date, start_time, end_time)
    )
    conn.commit()
    event_id = cursor.lastrowid
    conn.close()

    return jsonify({'message': 'Event created successfully', 'event_id': event_id}), 201

# test for working api
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)