# Vercel Deployment Guide for EngiTech

## Prerequisites
1. GitHub account
2. Vercel account (free tier)
3. MongoDB Atlas account (free tier)

## Step-by-Step Deployment

### 1. Setup MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/engitech?retryWrites=true&w=majority
   ```

### 2. Push Code to GitHub

```bash
# Initialize git (if not already done)
cd /app
git init
git add .
git commit -m "Initial commit - EngiTech by Anuj Kumar"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/engitech.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to https://vercel.com/signup
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

### 4. Add Environment Variables on Vercel

Go to Project Settings → Environment Variables and add:

**For Backend:**
```
MONGO_URL=your_mongodb_atlas_connection_string
DB_NAME=engitech
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
ADMIN_EMAIL=admin@engitech.com
ADMIN_PASSWORD=admin123
CORS_ORIGINS=*
```

**For Frontend:**
```
REACT_APP_BACKEND_URL=https://your-app-name.vercel.app
```

### 5. Deploy

Click "Deploy" and wait for it to complete!

## Alternative: Split Deployment (Recommended for Complex Apps)

### Frontend on Vercel + Backend on Railway/Render

**Vercel (Frontend only):**
- Deploy just the `/frontend` folder
- Set `REACT_APP_BACKEND_URL` to your backend URL

**Railway (Backend + MongoDB):**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables
5. Railway will auto-deploy

## Troubleshooting

**MongoDB Connection Issues:**
- Make sure to whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
- Replace username/password in connection string
- Use the correct database name

**Build Errors:**
- Check Node version (should be 18+)
- Verify all dependencies in package.json

**API Not Working:**
- Check CORS settings
- Verify environment variables are set
- Check Vercel function logs

## Your App URLs After Deployment

- Frontend: `https://engitech.vercel.app`
- Backend API: `https://engitech.vercel.app/api`
- Admin Panel: `https://engitech.vercel.app/admin`

Created by Anuj Kumar
