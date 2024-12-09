import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = None


def configure_jwt(secret_key):
    """
    Configure the JWT utility with the application's secret key.
    """
    global SECRET_KEY
    SECRET_KEY = secret_key


def generate_token(user_id):
    """
    Generate a JWT for a given user, with expiration set in UTC.
    """
    if not SECRET_KEY:
        raise ValueError(
            "SECRET_KEY is not configured. Call configure_jwt() during app initialization."
        )

    now = datetime.now(timezone.utc)  # Current time in UTC
    exp = now + timedelta(hours=1)  # Token expires in 1 hour

    payload = {"user_id": user_id, "exp": exp.timestamp()}  # Convert to Unix timestamp
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def validate_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"Decoded payload: {payload}")

        # Convert expiration time to a human-readable format
        exp = datetime.fromtimestamp(payload["exp"], timezone.utc)
        print(f"Token expiration time (UTC): {exp}")

        # Check if the token has expired
        current_time = datetime.now(timezone.utc)
        print(f"Current time (UTC): {current_time}")

        if payload["exp"] < current_time.timestamp():
            print("Token has expired.")
            return None

        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        print("Token has expired (ExpiredSignatureError).")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid token error: {e}")
        return None
