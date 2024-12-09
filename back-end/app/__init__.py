from flask import Flask
from .config import Config
from flask_cors import CORS
from app.auth.token_utils import configure_jwt
from .routes import register_routes

def create_app():
    """
    Factory function to create and configure the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Configure JWT with secret key
    configure_jwt(app.config['SECRET_KEY'])

    # Register routes
    register_routes(app)

    return app
