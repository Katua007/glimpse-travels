from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt

# Local imports
from config import db
from sqlalchemy_serializer import SerializerMixin
# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    # Define columns with db.Column()
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # The actual column to store the hashed password
    _password_hash = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Define relationships with db.relationship()
    trips = db.relationship('Trip', backref='user', lazy=True)
    followed_trips = db.relationship('TripFollowers', backref='user', lazy=True)
    # Prevent password_hash from being serialized
    serialize_rules = ('-trips.user', '-followed_trips.user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        # Hash the password and store it
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self, password):
        # Check if the provided password matches the stored hash
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))


# Trip Model
class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    destination = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    # Foreign key to link to a User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Define relationships
    photos = db.relationship('Photo', backref='trip', lazy=True)
    followers = db.relationship('TripFollowers', backref='trip', lazy=True)
     # Exclude user, photos, and followers from trip serialization to prevent recursion
    serialize_rules = ('-user.trips', '-photos.trip', '-followers.trip', '-followers.user')

# Photo Model
class Photo(db.Model, SerializerMixin):
    __tablename__ = 'photos'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    caption = db.Column(db.String(255))
    # Foreign key to link to a Trip
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    # Exclude the trip from photo serialization
    serialize_rules = ('-trip.photos',)

# TripFollowers (Association Table)
class TripFollowers(db.Model, SerializerMixin):
    __tablename__ = 'trip_followers'
    id = db.Column(db.Integer, primary_key=True)
    # Foreign keys for the many-to-many relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    # User-submittable attribute!
    reason_for_following = db.Column(db.String(255))
     # Exclude the trip and user from TripFollowers serialization
    serialize_rules = ('-trip.followers', '-user.followed_trips',)