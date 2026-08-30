import re

from sqlalchemy import UniqueConstraint
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    bio = db.Column(db.String(500), default='Adventure seeker & travel enthusiast')
    rating = db.Column(db.Float, default=4.5)
    wishlist = db.Column(db.Text)  # JSON string of wished destinations
    trips = db.relationship('Trip', backref='user', lazy=True)
    followed_trips = db.relationship('TripFollowers', backref='user', lazy=True)
    serialize_rules = ('-trips', '-followed_trips', '-_password_hash')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, username):
        if not username or not (3 <= len(username) <= 80):
            raise ValueError('Username must be between 3 and 80 characters.')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email or not EMAIL_RE.match(email):
            raise ValueError('A valid email address is required.')
        return email


class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    destination = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    photos = db.relationship('Photo', backref='trip', lazy=True, cascade='all, delete-orphan')
    followers = db.relationship('TripFollowers', backref='trip', lazy=True, cascade='all, delete-orphan')
    serialize_rules = ('-user',)
    datetime_format = '%Y-%m-%dT%H:%M:%S'

    @validates('title')
    def validate_title(self, key, title):
        if not title or not title.strip():
            raise ValueError('Trip title is required.')
        return title

    @validates('destination')
    def validate_destination(self, key, destination):
        if not destination or not destination.strip():
            raise ValueError('Trip destination is required.')
        return destination

    @validates('start_date')
    def validate_start_date(self, key, start_date):
        if self.end_date and start_date and self.end_date < start_date:
            raise ValueError('End date must be on or after the start date.')
        return start_date

    @validates('end_date')
    def validate_end_date(self, key, end_date):
        if self.start_date and end_date and end_date < self.start_date:
            raise ValueError('End date must be on or after the start date.')
        return end_date


class Photo(db.Model, SerializerMixin):
    __tablename__ = 'photos'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    caption = db.Column(db.String(255))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    serialize_rules = ('-trip',)


class TripFollowers(db.Model, SerializerMixin):
    __tablename__ = 'trip_followers'
    __table_args__ = (
        UniqueConstraint('user_id', 'trip_id', name='uq_trip_followers_user_trip'),
    )
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    reason_for_following = db.Column(db.String(255))
    serialize_rules = ('-trip', '-user')
