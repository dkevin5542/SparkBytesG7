# app.py

"""
Flask Backend for Spark Bytes

This application provides a RESTful API for managing users, events, RSVPs, favorites, and reviews.

Key Features:
- CRUD operations for events
- RSVP functionality for events
- Managing users' favorite events
- Submitting reviews for attended events
- Updating user preferences
"""

from app import create_app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(host="localhost", port=5002, debug=True)
