#!/usr/bin/env python3

from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Trip, Photo, TripFollowers

# Define your resource classes here
class Trips(Resource):
    def get(self):
        # Your logic to get all trips
        return {'message': 'Trips resource'}, 200

# Add your resources to the API
api.add_resource(Trips, '/trips')

if __name__ == '__main__':
    app.run(port=5555, debug=True)