import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

load_dotenv()

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy()
migrate = Migrate()

# Instantiate app, set attributes
app = Flask(__name__)

# Production configuration
if os.environ.get('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL').replace('postgres://', 'postgresql://')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.json.compact = False

# Flask-RESTful wraps Flask's exception handling and swallows any error that
# isn't an HTTPException as a generic 500, so flask-jwt-extended's own error
# handlers (NoAuthorizationError, ExpiredSignatureError, ...) never run
# unless we tell Flask to propagate those exceptions to its real handlers.
app.config['PROPAGATE_EXCEPTIONS'] = True

# Instantiate REST API
api = Api(app)

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db, render_as_batch=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Explicit origin allowlist — credentialed cross-site cookies are fragile and
# increasingly blocked by browsers, so auth uses bearer tokens instead and
# CORS just needs to let the frontend origin(s) through.
cors_origins = [
    origin.strip()
    for origin in os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    if origin.strip()
]
CORS(app, origins=cors_origins)
