from datetime import datetime

from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, api, db
from models import User, Trip, Photo, TripFollowers

TRIP_TEXT_FIELDS = ('title', 'destination')
TRIP_DATE_FIELDS = ('start_date', 'end_date')


class Health(Resource):
    def get(self):
        return {'status': 'ok'}, 200


api.add_resource(Health, '/health')


class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user = User.query.get(int(get_jwt_identity()))
        if user:
            return user.to_dict(), 200
        return {'error': 'No active session'}, 401


class Signup(Resource):
    def post(self):
        data = request.get_json() or {}
        if not data.get('username') or not data.get('password'):
            return {'error': 'Username and password are required.'}, 400
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
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 400
        except IntegrityError:
            db.session.rollback()
            return {'error': 'Username or email is already taken.'}, 400
        except Exception:
            db.session.rollback()
            app.logger.exception('Signup failed')
            return {'error': 'Could not create account. Please try again.'}, 400


class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password', '')):
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
        data = request.get_json() or {}
        missing = [f for f in (*TRIP_TEXT_FIELDS, *TRIP_DATE_FIELDS) if not data.get(f)]
        if missing:
            return {'error': f"Missing required field(s): {', '.join(missing)}"}, 400
        try:
            new_trip = Trip(
                title=data['title'],
                destination=data['destination'],
                start_date=datetime.fromisoformat(data['start_date']),
                end_date=datetime.fromisoformat(data['end_date']),
                user_id=int(get_jwt_identity())
            )
            db.session.add(new_trip)
            db.session.commit()
            return new_trip.to_dict(), 201
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 400
        except IntegrityError:
            db.session.rollback()
            app.logger.exception('Failed to create trip')
            return {'error': 'Could not create trip. Please try again.'}, 400


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

        data = request.get_json() or {}
        try:
            for field in TRIP_TEXT_FIELDS:
                if field in data:
                    setattr(trip, field, data[field])
            for field in TRIP_DATE_FIELDS:
                if field in data:
                    setattr(trip, field, datetime.fromisoformat(data[field]))
            db.session.commit()
            return trip.to_dict(), 200
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 400
        except IntegrityError:
            db.session.rollback()
            app.logger.exception('Failed to update trip %s', id)
            return {'error': 'Could not update trip. Please try again.'}, 400

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
        data = request.get_json() or {}
        if not data.get('url'):
            return {'error': 'Photo URL is required.'}, 400

        trip = Trip.query.get(data.get('trip_id'))
        if not trip or trip.user_id != int(get_jwt_identity()):
            return {'error': 'Forbidden or Trip not found'}, 403

        try:
            new_photo = Photo(url=data['url'], caption=data.get('caption'), trip_id=trip.id)
            db.session.add(new_photo)
            db.session.commit()
            return new_photo.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            db.session.rollback()
            return {'error': str(e) if isinstance(e, ValueError) else 'Could not add photo.'}, 400


api.add_resource(Photos, '/photos')


class TripFollowersList(Resource):
    def get(self):
        return [follower.to_dict() for follower in TripFollowers.query.all()], 200

    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        trip_id = data.get('trip_id')
        if not trip_id or not Trip.query.get(trip_id):
            return {'error': 'Trip not found'}, 404

        try:
            new_follower = TripFollowers(
                user_id=int(get_jwt_identity()),
                trip_id=trip_id,
                reason_for_following=data.get('reason_for_following')
            )
            db.session.add(new_follower)
            db.session.commit()
            return new_follower.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': 'You are already following this trip.'}, 400
        except Exception:
            db.session.rollback()
            app.logger.exception('Failed to follow trip')
            return {'error': 'Could not follow trip. Please try again.'}, 400


api.add_resource(TripFollowersList, '/trip-followers')


class TripFollowersResource(Resource):
    @jwt_required()
    def delete(self, user_id, trip_id):
        if int(get_jwt_identity()) != user_id:
            return {'error': 'Forbidden'}, 403

        follower = TripFollowers.query.filter_by(user_id=user_id, trip_id=trip_id).first()
        if follower:
            db.session.delete(follower)
            db.session.commit()
            return {}, 204
        return {'error': 'Follower not found'}, 404


api.add_resource(TripFollowersResource, '/trip-followers/<int:user_id>/<int:trip_id>')


class Users(Resource):
    def get(self):
        limit = min(max(request.args.get('limit', 20, type=int) or 20, 1), 100)
        offset = max(request.args.get('offset', 0, type=int) or 0, 0)
        users = User.query.order_by(User.id).offset(offset).limit(limit).all()
        return [user.to_dict() for user in users], 200


class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict(), 200


class UserTrips(Resource):
    def get(self, id):
        if not User.query.get(id):
            return {'error': 'User not found'}, 404
        trips = Trip.query.filter_by(user_id=id).all()
        return [trip.to_dict() for trip in trips], 200


api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(UserTrips, '/users/<int:id>/trips')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
