# 🚀 Vercel Deployment - Environment Variables

## ⚠️ CRITICAL: Add These in Vercel Dashboard

Go to: **Your Project → Settings → Environment Variables**

### Frontend Environment Variables
```env
REACT_APP_BACKEND_URL=https://engitech-backend.vercel.app
```

### Backend Environment Variables
```env
MONGO_URL=mongodb+srv://anujkumar170705_db_user:Anujkumar0917@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=engitech
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef123456
ADMIN_EMAIL=admin@engitech.com
ADMIN_PASSWORD=admin123
CORS_ORIGINS=https://engi-tech-1auw-one.vercel.app,https://engi-tech-1auw-one.vercel.app/login
FRONTEND_URL=https://engi-tech-1auw-one.vercel.app
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
