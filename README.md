Glimpse Travels ✈️
Glimpse Travels is a full-stack web application designed to help users document and share their travel experiences. Users can create, view, and manage their trips, add photos to their adventures, and follow trips created by others. The application showcases a secure, multi-user platform with robust data relationships.

✨ Features
User Authentication: Secure user signup, login, and logout.

Trip Management: Full CRUD (Create, Read, Update, Delete) functionality for managing trips.

Photo Integration: Users can add photos to their trips, with each photo linked to a specific trip.

Trip Followers: Implements a many-to-many relationship, allowing users to "follow" trips and view who else is following them.

Personalized Profiles: A user's profile displays all the trips they have created.

Authorization: Ensures users can only edit or delete their own trips and add photos to their own trips.

💻 Technologies Used
Backend
Flask: A lightweight Python web framework.

Flask-SQLAlchemy: An ORM for interacting with the database.

Flask-RESTful: An extension for building REST APIs.

Flask-Bcrypt: For secure password hashing.

SQLite3: The database used for development.

Pipenv: A dependency management tool for Python.

Frontend
React: A JavaScript library for building user interfaces.

React Router: For client-side routing.

Formik & Yup: For building and validating forms.

JavaScript (ES6+): The core language for frontend logic.

CSS: For styling and layouts (using Flexbox and Grid).

NPM: The package manager for Node.js.

🚀 Installation
Follow these steps to set up and run the application on your local machine.

Prerequisites
Make sure you have the following installed:

Python 3

Node.js (which includes npm)

Pipenv (pip install pipenv)

Backend Setup
Navigate to the server/ directory in your terminal:

Bash

cd server
Install the required Python packages:

Bash

pipenv install
Run the database migrations and seed the database with sample data:

Bash

# Activates the virtual environment and runs the shell script
pipenv run seed
Start the Flask server:

Bash

pipenv run flask run -p 5555
The backend API should now be running at http://localhost:5555.

Frontend Setup
Open a new terminal window and navigate to the client/ directory:

Bash

cd client
Install the required Node.js packages:

Bash

npm install
Start the React development server:

Bash

npm start
The frontend application will now be available in your browser at http://localhost:3000.

⚙️ Usage
Sign up: Navigate to http://localhost:3000/signup to create a new user account.

Log in: Use your new credentials at http://localhost:3000/login.

Create a Trip: Once logged in, use the "Create Trip" link to add a new travel destination.

View & Manage Trips: Go to the "All Trips" page to view and interact with all available trips. You can only edit or delete trips that you own.

Add Photos: On a trip's detail page, if you are the owner, you can add a photo to the trip.
