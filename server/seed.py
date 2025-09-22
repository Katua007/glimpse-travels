#!/usr/bin/env python3

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Trip, Photo, TripFollowers

if __name__ == '__main__':
    with app.app_context():
        # Clear existing data
        print("Clearing old data...")
        TripFollowers.query.delete()
        Photo.query.delete()
        Trip.query.delete()
        User.query.delete()

        # Seed data goes here
        fake = Faker()
        print("Starting to seed database...")

        # Create users
        print("Creating users...")
        users = []
        for i in range(10):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                # Add other attributes
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        # Create trips and photos
        print("Creating trips and photos...")
        trips = []
        photos = []
        for user in users:
            for i in range(fake.random_int(min=1, max=5)):
                trip = Trip(
                    title=fake.catch_phrase(),
                    destination=fake.city(),
                    start_date=fake.date_this_year(),
                    end_date=fake.date_this_year(),
                    user_id=user.id
                )
                trips.append(trip)
                # Add photos to the trip
                for j in range(fake.random_int(min=1, max=3)):
                    photo = Photo(
                        url=fake.image_url(),
                        caption=fake.sentence(),
                        trip=trip
                    )
                    photos.append(photo)

        db.session.add_all(trips)
        db.session.add_all(photos)
        db.session.commit()

        # Create trip followers
        print("Creating trip followers...")
        trip_followers = []
        # Assign random followers to random trips
        for i in range(15):
            follower = TripFollowers(
                user_id=fake.random_element(elements=[u.id for u in users]),
                trip_id=fake.random_element(elements=[t.id for t in trips]),
                reason_for_following=fake.sentence()
            )
            trip_followers.append(follower)
        
        db.session.add_all(trip_followers)
        db.session.commit()
        
        print("Database seeding complete!")