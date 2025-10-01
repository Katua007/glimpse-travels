import os
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
api = Api(app)
CORS(app, origins='*')

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    bio = db.Column(db.Text)
    rating = db.Column(db.Float, default=4.0)
    wishlist = db.Column(db.Text)
    
    def authenticate(self, password):
        return self.password_hash == password

class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    photos = db.relationship('Photo', backref='trip', lazy=True, cascade='all, delete-orphan')
    followers = db.relationship('TripFollowers', backref='trip', lazy=True, cascade='all, delete-orphan')

class Photo(db.Model):
    __tablename__ = 'photos'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))

class TripFollowers(db.Model):
    __tablename__ = 'trip_followers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    reason_for_following = db.Column(db.Text)

# Define your resource classes here
class CheckSession(Resource):
    def get(self):
        if 'user_id' in session:
            user = User.query.filter_by(id=session['user_id']).first()
            if user:
                return {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'bio': user.bio,
                    'rating': user.rating
                }, 200
        return {'error': 'No active session'}, 401

class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            user = User(
                username=data['username'],
                email=data.get('email', f"{data['username']}@example.com")
            )
            user.password_hash = data['password']
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'rating': user.rating
            }, 201
        except Exception as e:
            return {'error': str(e)}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.authenticate(data['password']):
            session['user_id'] = user.id
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'rating': user.rating
            }, 200
        return {'error': 'Invalid credentials'}, 401

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204

api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

class Trips(Resource):
    # GET: Get all trips
    def get(self):
        trips = Trip.query.all()
        trips_data = []
        for trip in trips:
            trip_dict = {
                'id': trip.id,
                'title': trip.title,
                'destination': trip.destination,
                'start_date': trip.start_date.isoformat() if trip.start_date else None,
                'end_date': trip.end_date.isoformat() if trip.end_date else None,
                'user_id': trip.user_id,
                'photos': [{
                    'id': photo.id,
                    'url': photo.url,
                    'caption': photo.caption
                } for photo in trip.photos],
                'followers': [{
                    'id': follower.id,
                    'user_id': follower.user_id,
                    'reason_for_following': follower.reason_for_following
                } for follower in trip.followers]
            }
            trips_data.append(trip_dict)
        return trips_data, 200

    # POST: Create a new trip
    def post(self):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401
            
        data = request.get_json()
        try:
            from datetime import datetime
            new_trip = Trip(
                title=data.get('title'),
                destination=data.get('destination'),
                start_date=datetime.fromisoformat(data.get('start_date')),
                end_date=datetime.fromisoformat(data.get('end_date')),
                user_id=session['user_id']
            )
            db.session.add(new_trip)
            db.session.commit()
            return {
                'id': new_trip.id,
                'title': new_trip.title,
                'destination': new_trip.destination,
                'start_date': new_trip.start_date.isoformat(),
                'end_date': new_trip.end_date.isoformat(),
                'user_id': new_trip.user_id
            }, 201
        except (ValueError, IntegrityError) as e:
            return {'error': str(e)}, 400

api.add_resource(Trips, '/trips')

class TripById(Resource):
    def get(self, id):
        trip = Trip.query.filter_by(id=id).first()
        if not trip:
            return {'error': 'Trip not found'}, 404
        trip_dict = {
            'id': trip.id,
            'title': trip.title,
            'destination': trip.destination,
            'start_date': trip.start_date.isoformat() if trip.start_date else None,
            'end_date': trip.end_date.isoformat() if trip.end_date else None,
            'user_id': trip.user_id,
            'photos': [{
                'id': photo.id,
                'url': photo.url,
                'caption': photo.caption
            } for photo in trip.photos],
            'followers': [{
                'id': follower.id,
                'user_id': follower.user_id,
                'reason_for_following': follower.reason_for_following
            } for follower in trip.followers]
        }
        return trip_dict, 200

    def patch(self, id):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401

        user_id = session['user_id']
        trip = Trip.query.filter_by(id=id, user_id=user_id).first()
        
        if not trip:
            return {'error': 'Forbidden or Trip not found'}, 403

        data = request.get_json()
        try:
            for attr, value in data.items():
                setattr(trip, attr, value)
            db.session.add(trip)
            db.session.commit()
            return {
                'id': trip.id,
                'title': trip.title,
                'destination': trip.destination,
                'start_date': trip.start_date.isoformat(),
                'end_date': trip.end_date.isoformat(),
                'user_id': trip.user_id
            }, 200
        except Exception as e:
            return {'error': str(e)}, 400

    def delete(self, id):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401

        user_id = session['user_id']
        trip = Trip.query.filter_by(id=id, user_id=user_id).first()
        
        if not trip:
            return {'error': 'Forbidden or Trip not found'}, 403

        db.session.delete(trip)
        db.session.commit()
        return {}, 204

api.add_resource(TripById, '/trips/<int:id>')

# Create a resource for photos to get all photos and post a new one
class Photos(Resource):
    def get(self):
        photos = Photo.query.all()
        photos_data = [{
            'id': photo.id,
            'url': photo.url,
            'caption': photo.caption,
            'trip_id': photo.trip_id
        } for photo in photos]
        return photos_data, 200
    
    def post(self):
        data = request.get_json()
        try:
            new_photo = Photo(
                url=data.get('url'),
                caption=data.get('caption'),
                trip_id=data.get('trip_id')
            )
            db.session.add(new_photo)
            db.session.commit()
            return {
                'id': new_photo.id,
                'url': new_photo.url,
                'caption': new_photo.caption,
                'trip_id': new_photo.trip_id
            }, 201
        except (ValueError, IntegrityError) as e:
            return {'error': str(e)}, 400

api.add_resource(Photos, '/photos')

class TripFollowersList(Resource):
    def get(self):
        followers = TripFollowers.query.all()
        followers_data = [{
            'id': follower.id,
            'user_id': follower.user_id,
            'trip_id': follower.trip_id,
            'reason_for_following': follower.reason_for_following
        } for follower in followers]
        return followers_data, 200
        
    def post(self):
        data = request.get_json()
        try:
            new_follower = TripFollowers(
                user_id=data['user_id'],
                trip_id=data['trip_id'],
                reason_for_following=data.get('reason_for_following')
            )
            db.session.add(new_follower)
            db.session.commit()
            return {
                'id': new_follower.id,
                'user_id': new_follower.user_id,
                'trip_id': new_follower.trip_id,
                'reason_for_following': new_follower.reason_for_following
            }, 201
        except Exception as e:
            return {'error': str(e)}, 400

class TripFollowersResource(Resource):
    def delete(self, user_id, trip_id):
        # Find the specific follower record
        follower = TripFollowers.query.filter_by(user_id=user_id, trip_id=trip_id).first()
        if follower:
            db.session.delete(follower)
            db.session.commit()
            return {}, 204
        return {'error': 'Follower not found'}, 404

class Users(Resource):
    def get(self):
        users = User.query.all()
        users_data = []
        for user in users:
            user_dict = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'rating': user.rating,
                'wishlist': user.wishlist
            }
            users_data.append(user_dict)
        return users_data, 200

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {'error': 'User not found'}, 404
        user_dict = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'rating': user.rating,
            'wishlist': user.wishlist
        }
        return user_dict, 200

# Add the new routes
api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(TripFollowersList, '/trip-followers')
api.add_resource(TripFollowersResource, '/trip-followers/<int:user_id>/<int:trip_id>')


# Initialize database
with app.app_context():
    db.create_all()
    
    # Seed data if empty
    if User.query.count() == 0:
        users = [
            User(username='TravellerOne', email='traveller@example.com', bio='Adventure seeker', rating=4.8, password_hash='password'),
            User(username='WandererSam', email='wanderer@example.com', bio='Wildlife photographer', rating=4.6, password_hash='password'),
            User(username='NomadExplorer', email='nomad@example.com', bio='Digital nomad', rating=4.9, password_hash='password')
        ]
        db.session.add_all(users)
        db.session.commit()
        
        trips = [
            Trip(title='Machu Picchu Adventure', destination='Peru', start_date=datetime(2024, 6, 1), end_date=datetime(2024, 6, 8), user_id=1),
            Trip(title='African Safari', destination='Kenya', start_date=datetime(2024, 7, 15), end_date=datetime(2024, 7, 22), user_id=2),
            Trip(title='Bali Island Escape', destination='Indonesia', start_date=datetime(2024, 8, 10), end_date=datetime(2024, 8, 17), user_id=3)
        ]
        db.session.add_all(trips)
        db.session.commit()
        
        photos = [
            Photo(url='https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop', trip_id=1, caption='Machu Picchu at sunrise'),
            Photo(url='https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop', trip_id=2, caption='Majestic elephant'),
            Photo(url='https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop', trip_id=3, caption='Bali rice terraces')
        ]
        db.session.add_all(photos)
        db.session.commit()

if __name__ == '__main__':
    app.run(port=5555, debug=True)