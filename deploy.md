# 🚀 Deployment Guide

## Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account

### Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create glimpse-travels-app
   ```

3. **Add PostgreSQL database:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key-here"
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Initialize database:**
   ```bash
   heroku run python server/seed.py
   ```

## Netlify + Railway Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Frontend (Netlify)
1. Build React app: `npm run build`
2. Deploy `build` folder to Netlify
3. Set API URL in environment variables

## Environment Variables
- `SECRET_KEY`: Flask secret key
- `DATABASE_URL`: Database connection string

## Build Commands
- **Backend**: `pip install -r requirements.txt`
- **Frontend**: `npm install && npm run build`