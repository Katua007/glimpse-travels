#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api
from models import User, Trip, Photo, TripFollowers

# Define your resource classes here
class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            user = User(
                username=data['username'],
                password_hash=data['password']
            )
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.authenticate(data['password']):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': 'Invalid credentials'}, 401

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

class Trips(Resource):
    # GET: Get all trips
    def get(self):
        trips = [trip.to_dict() for trip in Trip.query.all()]
        return trips, 200

    # POST: Create a new trip
    def post(self):
        data = request.get_json()
        try:
            new_trip = Trip(
                title=data.get('title'),
                destination=data.get('destination'),
                start_date=data.get('start_date'),
                end_date=data.get('end_date'),
                user_id=data.get('user_id')
            )
            db.session.add(new_trip)
            db.session.commit()
            return new_trip.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            return {'error': str(e)}, 400

api.add_resource(Trips, '/trips')

class TripById(Resource):
    def get(self, id):
        trip = Trip.query.filter_by(id=id).first()
        if not trip:
            return {'error': 'Trip not found'}, 404
        return trip.to_dict(), 200

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
            return trip.to_dict(), 200
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
        photos = [photo.to_dict() for photo in Photo.query.all()]
        return photos, 200
    
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
            return new_photo.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            return {'error': str(e)}, 400

api.add_resource(Photos, '/photos')

class TripFollowersList(Resource):
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
            return new_follower.to_dict(), 201
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

# Add the new routes
api.add_resource(TripFollowersList, '/trip-followers')
api.add_resource(TripFollowersResource, '/trip-followers/<int:user_id>/<int:trip_id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)