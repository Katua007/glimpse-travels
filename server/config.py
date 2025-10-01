import os
from flask import Flask
from flask_cors import CORS
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
app.json.compact = False

# Instantiate REST API
api = Api(app)

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)
bcrypt = Bcrypt(app)

# Instantiate CORS
CORS(app, origins=['https://glimpse-travels.vercel.app', 'http://localhost:3000'], supports_credentials=True)