# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# get connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM User').fetchall()
    conn.close()
    user_list = [dict(row) for row in users]
    return jsonify(user_list)

# events
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM Event').fetchall()
    conn.close()
    event_list = [dict(row) for row in events]
    return jsonify(event_list)

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