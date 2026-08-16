# 🚀 Vercel Deployment - Environment Variables

## ⚠️ CRITICAL: Add These in Vercel Dashboard

Go to: **Your Project → Settings → Environment Variables**

### Frontend Environment Variables
```env
REACT_APP_BACKEND_URL=https://engitech-backend.vercel.app
```

### Backend Environment Variables
> ⚠️ Real values used to be committed here in plaintext. They've been rotated
> and removed — set the actual values only in the Vercel dashboard, never in
> this file. See `AUTH_SETUP.md` step 0.
```env
MONGO_URL=<set in Vercel dashboard only>
DB_NAME=engitech
JWT_SECRET=<set in Vercel dashboard only — generate with `openssl rand -hex 32`>
ADMIN_EMAIL=<set in Vercel dashboard only>
ADMIN_PASSWORD=<set in Vercel dashboard only>
CORS_ORIGINS=https://engi-tech-1auw-one.vercel.app,https://engi-tech-1auw-one.vercel.app/login
FRONTEND_URL=https://engi-tech-1auw-one.vercel.app
GOOGLE_CLIENT_ID=<set in Vercel dashboard only>
GITHUB_CLIENT_ID=<set in Vercel dashboard only>
GITHUB_CLIENT_SECRET=<set in Vercel dashboard only>
GITHUB_REDIRECT_URI=https://engi-tech-1auw-one.vercel.app/auth/github/callback
RESEND_API_KEY=<set in Vercel dashboard only>
RESEND_FROM_EMAIL=EngiTech <onboarding@resend.dev>
```

## 🔧 After Adding Environment Variables

1. **Redeploy your backend** on Vercel:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Redeploy your frontend** on Vercel:
   - Same process as above

## ✅ What This Fixes

- ✅ CORS will allow requests from `https://engi-tech-1auw-one.vercel.app`
- ✅ Backend will connect to MongoDB Atlas
- ✅ Authentication cookies will work
- ✅ All API calls will succeed

## 🎯 Quick Fix (If Still Not Working)

**In Backend Environment Variables, change:**
```env
CORS_ORIGINS=*
```

This allows ALL origins (less secure but will definitely work for testing)

## 📝 How to Update Environment Variables

### Frontend (engi-tech-1auw-one.vercel.app)
1. Go to: https://vercel.com/your-username/engi-tech-1auw-one
2. Settings → Environment Variables
3. Add: `REACT_APP_BACKEND_URL` = `https://engitech-backend.vercel.app`
4. Redeploy

### Backend (engitech-backend.vercel.app)
1. Go to: https://vercel.com/your-username/engitech-backend
2. Settings → Environment Variables
3. Add all variables listed above
4. **Most Important:**
   ```
   CORS_ORIGINS=https://engi-tech-1auw-one.vercel.app
   ```
5. Redeploy

## 🔍 Verify It's Working

After redeploying, open browser console and check:
- ✅ No CORS errors
- ✅ API requests succeed
- ✅ Can login/register

## ⚡ Alternative: Update Frontend URL

If your frontend URL changes, update backend env var:
```env
CORS_ORIGINS=https://your-new-frontend-url.vercel.app
```

---

**Created by Anuj Kumar**
