# 🔥 URGENT FIX: CORS Error on Vercel

## Your Current Issue

**Frontend:** https://engi-tech-1auw-one.vercel.app  
**Backend:** https://engitech-backend.vercel.app  
**Error:** `blocked by CORS policy: No 'Access-Control-Allow-Origin'`

## ✅ SOLUTION (3 Steps)

### Step 1: Update Backend Environment Variables

1. Go to **Vercel Dashboard** → **engitech-backend project**
2. Click **Settings** → **Environment Variables**
3. Add/Update these variables:

```env
CORS_ORIGINS=https://engi-tech-1auw-one.vercel.app
MONGO_URL=mongodb+srv://anujkumar170705_db_user:Anujkumar0917@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=engitech
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef123456
ADMIN_EMAIL=admin@engitech.com
ADMIN_PASSWORD=admin123
```

### Step 2: Update Frontend Environment Variable

1. Go to **Vercel Dashboard** → **engi-tech-1auw-one project**
2. Click **Settings** → **Environment Variables**
3. Add/Update:

```env
REACT_APP_BACKEND_URL=https://engitech-backend.vercel.app
```

### Step 3: Redeploy Both

1. **Backend:** Go to Deployments → Click "..." → Redeploy
2. **Frontend:** Go to Deployments → Click "..." → Redeploy

## 🚀 Quick Fix (Testing)

If you want it to work **immediately** for testing:

**Backend Environment Variable:**
```env
CORS_ORIGINS=*
```

This allows ALL origins (works but less secure). Change it later to specific domain.

## ✅ How to Verify It's Fixed

1. Open your frontend: https://engi-tech-1auw-one.vercel.app/login
2. Open browser console (F12)
3. Try to login
4. Should see:
   - ✅ No CORS errors
   - ✅ API calls succeed
   - ✅ Login works

## 📸 What You'll See After Fix

**Console (No Errors):**
```
✓ POST https://engitech-backend.vercel.app/api/auth/login 200 OK
✓ GET https://engitech-backend.vercel.app/api/equipment 200 OK
```

**Backend Response Headers:**
```
Access-Control-Allow-Origin: https://engi-tech-1auw-one.vercel.app
Access-Control-Allow-Credentials: true
```

## 🎯 Updated Code (Already Done Locally)

Your backend code (`/app/backend/server.py`) has been updated to:
- ✅ Allow your Vercel frontend URL
- ✅ Support credentials (cookies)
- ✅ Handle OPTIONS requests
- ✅ Proper CORS headers

**You just need to push this code to GitHub and redeploy!**

## 📝 Deploy Updated Code to Vercel

```bash
cd /app
git add .
git commit -m "Fix CORS for Vercel deployment"
git push origin main
```

Vercel will auto-deploy the updated code!

## ⚠️ MongoDB Atlas Setup

Don't forget:
1. Go to MongoDB Atlas → **Network Access**
2. Add IP: **0.0.0.0/0** (Allow from anywhere)
3. This lets Vercel servers connect to your database

## 🔍 Still Having Issues?

### Check Backend Logs on Vercel:
1. Go to your backend project on Vercel
2. Click latest deployment
3. Click "View Function Logs"
4. Look for errors

### Check Frontend Network Tab:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check response headers

### Common Issues:

**"CORS_ORIGINS not set"**
- Add `CORS_ORIGINS` environment variable in Vercel

**"MongoDB connection failed"**
- Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0)
- Verify connection string is correct

**"Authentication failed"**
- Check JWT_SECRET is set in backend
- Clear browser cookies and try again

---

**Your app will work after these 3 steps!** 🎉

Created by Anuj Kumar
