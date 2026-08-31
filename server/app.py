from datetime import datetime

from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, api, db
from models import User, Trip, Photo, TripFollowers


class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user = User.query.get(int(get_jwt_identity()))
        if user:
            return user.to_dict(), 200
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
            token = create_access_token(identity=str(user.id))
            return {'token': token, 'user': user.to_dict()}, 201
        except Exception as e:
            return {'error': str(e)}, 400


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.authenticate(data['password']):
            token = create_access_token(identity=str(user.id))
            return {'token': token, 'user': user.to_dict()}, 200
        return {'error': 'Invalid credentials'}, 401


class Logout(Resource):
    def delete(self):
        # Stateless JWTs: nothing to invalidate server-side, this exists so
        # the frontend has a symmetric call to make when a user logs out.
        return {}, 204


api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')


class Trips(Resource):
    def get(self):
        return [trip.to_dict() for trip in Trip.query.all()], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        try:
            new_trip = Trip(
                title=data.get('title'),
                destination=data.get('destination'),
                start_date=datetime.fromisoformat(data.get('start_date')),
                end_date=datetime.fromisoformat(data.get('end_date')),
                user_id=int(get_jwt_identity())
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

    @jwt_required()
    def patch(self, id):
        user_id = int(get_jwt_identity())
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

    @jwt_required()
    def delete(self, id):
        user_id = int(get_jwt_identity())
        trip = Trip.query.filter_by(id=id, user_id=user_id).first()

        if not trip:
            return {'error': 'Forbidden or Trip not found'}, 403

        db.session.delete(trip)
        db.session.commit()
        return {}, 204


api.add_resource(TripById, '/trips/<int:id>')


class Photos(Resource):
    def get(self):
        return [photo.to_dict() for photo in Photo.query.all()], 200

    @jwt_required()
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
    def get(self):
        return [follower.to_dict() for follower in TripFollowers.query.all()], 200

    @jwt_required()
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


api.add_resource(TripFollowersList, '/trip-followers')


class TripFollowersResource(Resource):
    @jwt_required()
    def delete(self, user_id, trip_id):
        follower = TripFollowers.query.filter_by(user_id=user_id, trip_id=trip_id).first()
        if follower:
            db.session.delete(follower)
            db.session.commit()
            return {}, 204
        return {'error': 'Follower not found'}, 404


api.add_resource(TripFollowersResource, '/trip-followers/<int:user_id>/<int:trip_id>')


class Users(Resource):
    def get(self):
        return [user.to_dict() for user in User.query.all()], 200


class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict(), 200


api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
