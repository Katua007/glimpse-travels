# Glimpse Travels ✈️

Glimpse Travels is a modern, full-stack travel documentation platform that allows users to create, share, and discover amazing travel experiences. Built with React and Flask, it features a beautiful, responsive design with comprehensive trip management and social features.

## ✨ Features

### 🔐 **User Authentication & Profiles**
- Secure user registration and login system
- Personalized user profiles with ratings and bios
- User statistics (trips created, photos uploaded, followers)
- Wishlist functionality for future travel destinations

### 🗺️ **Trip Management**
- Create, edit, and delete travel trips
- Beautiful trip cards with destination photos
- Continental filtering (South America, Africa, Asia, Europe, North America)
- Trip details with photo galleries and owner information
- Date-based trip organization (past and future trips)

### 📸 **Photo Integration**
- Upload and manage trip photos with captions
- High-quality image display with Unsplash integration
- Photo galleries for each trip
- Automatic image optimization and fallbacks

### 👥 **Social Features**
- Follow other users' trips
- Recommended travel profiles with ratings
- View other travelers' visited countries and wishlists
- Trip follower system with reasons for following

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Smooth animations and hover effects
- Beautiful gradient themes and modern styling
- Intuitive navigation with icons and clear labels

## 💻 Technologies Used

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - Database ORM
- **Flask-RESTful** - REST API development
- **Flask-Bcrypt** - Password hashing
- **SQLite** - Database for development
- **Pipenv** - Python dependency management

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **Modern CSS** - Flexbox, Grid, and animations
- **Unsplash API** - High-quality travel images

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+ (includes npm)
- Git

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd glimpse-travels
   ```

2. **Install Python dependencies:**
   ```bash
   cd server
   pip install pipenv
   pipenv install
   ```

3. **Set up the database:**
   ```bash
   pipenv run python seed.py
   ```

4. **Install Node.js dependencies:**
   ```bash
   cd ../client
   npm install
   ```

5. **Start both servers:**
   ```bash
   # From the root directory
   ./start_servers.sh
   ```

   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd server && pipenv run flask run -p 5555
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5555

## 📊 Sample Data

The application comes pre-loaded with:

### **14 Sample Trips Across All Continents:**
- **South America:** Machu Picchu Adventure, Amazon Rainforest Expedition
- **Africa:** African Safari, Moroccan Desert Trek, Cape Town Wine Tour
- **Asia:** Bali Island Escape, Thai Island Hopping, Cherry Blossom Festival, Golden Triangle Tour
- **Europe:** European Grand Tour, Greek Island Adventure, Paris & French Riviera
- **North America:** Yellowstone National Park, Canadian Rockies Expedition

### **6 User Profiles with Ratings:**
- **TravellerOne** (4.8⭐) - Ancient civilizations explorer
- **WandererSam** (4.6⭐) - Wildlife photographer
- **NomadExplorer** (4.9⭐) - Digital nomad
- **CultureSeeker** (4.4⭐) - Art and museum enthusiast
- **AdventureQueen** (4.7⭐) - Extreme sports adventurer
- **FoodieWanderer** (4.5⭐) - Culinary explorer

## 🎯 Usage Guide

### Getting Started
1. **Sign Up:** Create a new account at `/signup`
2. **Explore:** Browse trips by continent on the home page
3. **Create:** Add your own trips with the "Create Trip" button
4. **Connect:** Follow other travelers and discover new destinations

### Key Features
- **Home Page:** Hero section with clickable feature cards
- **Explore Trips:** Filter by continent, view trip cards with photos
- **My Profile:** View your trips, stats, and manage your account
- **Trip Details:** Beautiful pages with photo galleries and trip information
- **Recommended Profiles:** Discover other travelers with similar interests

## 🔧 API Endpoints

- `GET /trips` - Get all trips with photos and followers
- `POST /trips` - Create a new trip (authenticated)
- `GET /trips/<id>` - Get specific trip details
- `GET /users` - Get all user profiles
- `GET /users/<id>` - Get specific user profile
- `POST /signup` - Create new user account
- `POST /login` - User authentication
- `GET /photos` - Get all photos
- `POST /photos` - Upload new photo (authenticated)

## 🎨 Design Features

- **Modern Gradient Themes:** Purple to blue gradients throughout
- **Responsive Design:** Works perfectly on desktop, tablet, and mobile
- **Smooth Animations:** Hover effects and transitions on all interactive elements
- **High-Quality Images:** Curated travel photos from Unsplash
- **Intuitive Navigation:** Clear icons and labels for all features

## 🚀 Deployment

The application is ready for deployment with:
- Production-optimized React build
- Flask production configuration
- Environment variable support
- Static file serving

---

**Built with ❤️ for travel enthusiasts worldwide**