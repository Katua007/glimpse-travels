from datetime import datetime

import pytest
from sqlalchemy.exc import IntegrityError

from config import db
from models import User, Trip


class TestUserValidation:
    def test_rejects_short_username(self, app):
        with app.app_context():
            with pytest.raises(ValueError):
                User(username='ab', email='ab@example.com')

    def test_rejects_invalid_email(self, app):
        with app.app_context():
            with pytest.raises(ValueError):
                User(username='validname', email='not-an-email')

    def test_rejects_duplicate_username(self, app):
        with app.app_context():
            u1 = User(username='alice', email='alice@example.com')
            u1.password_hash = 'password123'
            db.session.add(u1)
            db.session.commit()

            u2 = User(username='alice', email='someone-else@example.com')
            u2.password_hash = 'password123'
            db.session.add(u2)
            with pytest.raises(IntegrityError):
                db.session.commit()


class TestTripValidation:
    def test_rejects_blank_title(self, app):
        with app.app_context():
            user = User(username='alice', email='alice@example.com')
            user.password_hash = 'password123'
            db.session.add(user)
            db.session.commit()

            with pytest.raises(ValueError):
                Trip(
                    title='   ',
                    destination='Peru',
                    start_date=datetime(2027, 1, 1),
                    end_date=datetime(2027, 1, 5),
                    user_id=user.id,
                )

    def test_rejects_blank_destination(self, app):
        with app.app_context():
            with pytest.raises(ValueError):
                Trip(
                    title='A trip',
                    destination='',
                    start_date=datetime(2027, 1, 1),
                    end_date=datetime(2027, 1, 5),
                    user_id=1,
                )

    def test_rejects_end_date_before_start_date(self, app):
        with app.app_context():
            with pytest.raises(ValueError):
                Trip(
                    title='A trip',
                    destination='Peru',
                    start_date=datetime(2027, 1, 10),
                    end_date=datetime(2027, 1, 5),
                    user_id=1,
                )

    def test_accepts_same_day_trip(self, app):
        with app.app_context():
            trip = Trip(
                title='Day trip',
                destination='Peru',
                start_date=datetime(2027, 1, 5),
                end_date=datetime(2027, 1, 5),
                user_id=1,
            )
            assert trip.title == 'Day trip'

    def test_cascade_deletes_photos_and_followers(self, app):
        from models import Photo, TripFollowers

        with app.app_context():
            owner = User(username='alice', email='alice@example.com')
            owner.password_hash = 'password123'
            follower = User(username='bob', email='bob@example.com')
            follower.password_hash = 'password123'
            db.session.add_all([owner, follower])
            db.session.commit()

            trip = Trip(
                title='A trip', destination='Peru',
                start_date=datetime(2027, 1, 1), end_date=datetime(2027, 1, 5),
                user_id=owner.id,
            )
            db.session.add(trip)
            db.session.commit()

            db.session.add(Photo(url='http://example.com/a.jpg', trip_id=trip.id))
            db.session.add(TripFollowers(user_id=follower.id, trip_id=trip.id))
            db.session.commit()

            db.session.delete(trip)
            db.session.commit()

            assert Photo.query.count() == 0
            assert TripFollowers.query.count() == 0
