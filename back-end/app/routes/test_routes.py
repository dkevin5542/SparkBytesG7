from flask import Blueprint, request, jsonify, session

test_blueprint = Blueprint('test_bp', __name__)

@test_blueprint.route('/api/data', methods=['GET'])
def get_data():
    """
    A test endpoint to verify that the API is working correctly.

    Returns:
        Flask.Response: JSON response with a dummy message and items.
    """
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

# test session info
@test_blueprint.route('/session-info')
def session_info():
    return jsonify(dict(session))

@test_blueprint.route('/set-session')
def set_session():
    session['user_id'] = 123  # Set a dummy user ID
    return 'Session set!'

@test_blueprint.route('/get-session')
def get_session():
    return f"user_id in session is: {session.get('user_id')}"