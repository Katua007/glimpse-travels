#!/usr/bin/env python3

from flask import request
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import User, Trip, Photo, TripFollowers
# Define your resource classes here
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
    # GET: Get a single trip
    def get(self, id):
        trip = db.session.get(Trip, id)
        if not trip:
            return {'error': 'Trip not found'}, 404
        return trip.to_dict(), 200

    # PATCH: Update a trip
    def patch(self, id):
        trip = db.session.get(Trip, id)
        if not trip:
            return {'error': 'Trip not found'}, 404

        data = request.get_json()
        try:
            for attr, value in data.items():
                setattr(trip, attr, value)
            db.session.add(trip)
            db.session.commit()
            return trip.to_dict(), 200
        except (ValueError, IntegrityError) as e:
            return {'error': str(e)}, 400

    # DELETE: Delete a trip
    def delete(self, id):
        trip = db.session.get(Trip, id)
        if not trip:
            return {'error': 'Trip not found'}, 404
        
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


if __name__ == '__main__':
    app.run(port=5555, debug=True)