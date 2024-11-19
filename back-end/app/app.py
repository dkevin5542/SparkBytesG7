# app.py

"""
Flask Backend for Spark Bytes

This application provides a RESTful API for managing users, events, RSVPs, favorites, and reviews.
It integrates Google OAuth for user authentication.

Key Features:
- User Authentication via Google OAuth
- CRUD operations for events
- RSVP functionality for events
- Managing users' favorite events
- Submitting reviews for attended events
- Updating user preferences
"""

from flask import Flask
from flask_session import Session
from flask_cors import CORS
from routes import register_routes
from config import Config

# Initialize Flask application and enable CORS
app = Flask(__name__)
app.config.from_object(Config)
Config.validate()
Session(app)
CORS(app, supports_credentials=True)

register_routes(app)

if __name__ == '__main__':
    app.run(host="localhost", port=5002, debug=True)