import jwt
import datetime
from flask import current_app

def generate_token(user_id):
    """
    Generate a JWT for a given user.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=5) # Expiration in EST
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

def validate_token(token):
    """
    Validate and decode a JWT.
    """
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.DecodeError:
        return None  # Invalid token
