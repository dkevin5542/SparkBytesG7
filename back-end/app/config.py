import os
from dotenv import load_dotenv
import secrets

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(16))
    SESSION_TYPE = 'filesystem'
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

    def validate():
        if not Config.GOOGLE_CLIENT_ID:
            raise ValueError("No GOOGLE_CLIENT_ID set for Flask application")
