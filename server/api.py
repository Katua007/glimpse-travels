from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Sample data
users = [
    {"id": 1, "username": "TravellerOne", "email": "traveller@example.com", "bio": "Adventure seeker", "rating": 4.8},
    {"id": 2, "username": "WandererSam", "email": "wanderer@example.com", "bio": "Wildlife photographer", "rating": 4.6},
    {"id": 3, "username": "NomadExplorer", "email": "nomad@example.com", "bio": "Digital nomad", "rating": 4.9}
]

trips = [
    {"id": 1, "title": "Machu Picchu Adventure", "destination": "Peru", "start_date": "2024-06-01", "end_date": "2024-06-08", "user_id": 1, "photos": [{"id": 1, "url": "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop", "caption": "Machu Picchu at sunrise"}], "followers": []},
    {"id": 2, "title": "African Safari", "destination": "Kenya", "start_date": "2024-07-15", "end_date": "2024-07-22", "user_id": 2, "photos": [{"id": 2, "url": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop", "caption": "Majestic elephant"}], "followers": []},
    {"id": 3, "title": "Bali Island Escape", "destination": "Indonesia", "start_date": "2024-08-10", "end_date": "2024-08-17", "user_id": 3, "photos": [{"id": 3, "url": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop", "caption": "Bali rice terraces"}], "followers": []}
]

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/trips', methods=['GET'])
def get_trips():
    return jsonify(trips)

@app.route('/check_session', methods=['GET'])
def check_session():
    return jsonify({"error": "No active session"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    new_user = {
        "id": len(users) + 1,
        "username": data.get('username'),
        "email": data.get('email'),
        "bio": "New traveler",
        "rating": 4.0
    }
    users.append(new_user)
    return jsonify(new_user), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = next((u for u in users if u['username'] == data.get('username')), None)
    if user:
        return jsonify(user), 200
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)