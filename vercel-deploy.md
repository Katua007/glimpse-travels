# Vercel Deployment Guide for Glimpse Travels

## Prerequisites
- Vercel account (free tier works)
- PostgreSQL database (recommend Neon, PlanetScale, or Supabase)
- GitHub repository

## Quick Deploy Steps

### 1. Database Setup
Choose one of these free PostgreSQL providers:

**Option A: Neon (Recommended)**
```bash
# Visit https://neon.tech
# Create account and database
# Copy connection string
```

**Option B: Supabase**
```bash
# Visit https://supabase.com
# Create project
# Go to Settings > Database
# Copy connection string
```

### 2. Deploy to Vercel

**Method 1: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Method 2: GitHub Integration**
1. Push code to GitHub
2. Visit https://vercel.com/dashboard
3. Click "New Project"
4. Import your repository
5. Configure environment variables

### 3. Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
```

### 4. Initialize Database
After deployment, run seed script:
```bash
vercel env pull .env.local
python server/seed.py
```

## Configuration Files

The project includes:
- `vercel.json` - Vercel configuration
- `client/package.json` - Frontend build settings
- `requirements.txt` - Python dependencies

## Troubleshooting

**Build Errors:**
- Check Vercel build logs
- Ensure all dependencies in requirements.txt
- Verify Python version compatibility

**Database Connection:**
- Ensure DATABASE_URL format: `postgresql://...`
- Check database credentials
- Verify database allows external connections

**API Routes Not Working:**
- Check vercel.json routes configuration
- Ensure Flask app runs locally first

## Post-Deployment

1. **Test the application:**
   - Visit your Vercel URL
   - Test user registration/login
   - Create a test trip
   - Upload photos

2. **Monitor performance:**
   - Check Vercel Analytics
   - Monitor database usage
   - Set up error tracking

## Custom Domain (Optional)
1. Go to Vercel Dashboard > Domains
2. Add your custom domain
3. Configure DNS records as shown


Your app will be live at: `https://glimpsetravels.vercel.app`
>>>>>>> c340389 (Restructured for Vercel deployment)
