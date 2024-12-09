import jwt
import datetime

SECRET_KEY = None

def configure_jwt(secret_key):
    """
    Configure the JWT utility with the application's secret key.
    """
    global SECRET_KEY
    SECRET_KEY = secret_key

def generate_token(user_id):
    """
    Generate a JWT for a given user.
    """
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not configured. Call configure_jwt() during app initialization.")
    
    payload = {
        'user_id': user_id,
        'exp': datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=5)  # Expiration in EST
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def validate_token(token):
    """
    Validate and decode a JWT.
    """
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not configured. Call configure_jwt() during app initialization.")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload.get('user_id')  # Extract user_id from payload
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.DecodeError:
        return None  # Invalid token