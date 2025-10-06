# 🌍 Glimpse Travels

A modern travel documentation and social platform where adventurers can share their journeys, discover new destinations, and connect with fellow travelers.

## ✨ Features

### 🎯 Core Functionality
- **Trip Planning & Documentation**: Create detailed trip itineraries with destinations, dates, and descriptions
- **Photo Gallery**: Upload and organize travel photos with captions
- **User Profiles**: Personalized profiles with travel statistics and bio
- **Trip Discovery**: Browse and explore trips from other travelers
- **Social Following**: Follow interesting trips and travelers
- **Destination Filtering**: Filter trips by continent and destination

### 🚀 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Clean, modern interface with easy-to-use navigation
- **Real-time Updates**: Dynamic content loading and updates
- **Travel Statistics**: Track visited countries, photos uploaded, and followers

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **CSS3** - Custom styling with modern design

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **RESTful API** - Clean API architecture

### Deployment
- **Vercel** - Frontend and backend hosting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/glimpse-travels.git
cd glimpse-travels
```

2. **Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm start
```
The frontend will run on `http://localhost:3000`

3. **Backend Setup**
```bash
# Navigate to server directory
cd server

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python api.py
```
The backend will run on `http://localhost:5000`

## 🚀 Deployment

### Vercel Deployment

1. **Deploy Backend**
   - Create new Vercel project
   - Set root directory to `server`
   - Deploy from GitHub

2. **Deploy Frontend**
   - Create new Vercel project
   - Set root directory to project root
   - Add environment variable: `REACT_APP_API_URL=your-backend-url`
   - Deploy from GitHub

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_URL=https://your-backend.vercel.app

# Backend (Vercel Dashboard)
SECRET_KEY=your-secret-key
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create your traveler account
2. **Create Profile**: Add your bio and travel preferences
3. **Plan Trip**: Document your upcoming or past adventures
4. **Add Photos**: Upload memorable moments from your journeys
5. **Explore**: Discover amazing destinations from other travelers
6. **Connect**: Follow trips and travelers that inspire you

### Key Pages
- **Home**: Welcome page with featured content
- **Trips**: Browse all travel adventures with filtering options
- **Profile**: Manage your trips and view statistics
- **Trip Details**: View detailed trip information with photos and followers

## 🎨 Screenshots

### Home Page
Beautiful landing page showcasing featured trips and recommended profiles.

### Trip Gallery
Explore trips organized by continent with stunning photography.

### User Dashboard
Personal space to manage your travel documentation and statistics.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🔗 Links

- **Live Demo**: [https://glimpse-travels.vercel.app/](https://glimpse-travels.vercel.app/)
- **API Documentation**: Available in `/server/api.py`
- **Design System**: Custom CSS with modern travel-themed styling

---

**Built with ❤️ for travelers, by travelers** 🌟
