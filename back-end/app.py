# app.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'Flask Dummy File',
        'items': [1, 2, 3, 4]
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
