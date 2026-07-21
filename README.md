# EngiTech - Engineering Equipment Reference Platform

**Created by Anuj Kumar**

A comprehensive B.Tech equipment reference platform for Mechanical, Electrical, Civil, and Electronics Engineering students.

## 🌟 Features

- 📚 83+ Equipment across 4 branches
- 📅 Year-wise (1-4) and Semester-wise (1-8) organization
- 🔍 Advanced search and filtering
- 🔖 Bookmark favorite equipment
- 👤 User authentication with JWT
- 🛠️ Admin panel for equipment management
- 🎨 Modern Swiss brutalist design with animations
- 📱 Fully responsive

## 🚀 Quick Deploy to Vercel

### Method 1: Deploy Button (Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/engitech)

### Method 2: Manual Deployment

#### 1. Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)

#### 2. Setup MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a FREE cluster
3. Get connection string from "Connect" → "Connect your application"
4. Whitelist all IPs (0.0.0.0/0) in Network Access

#### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit by Anuj Kumar"
git remote add origin https://github.com/YOUR_USERNAME/engitech.git
git push -u origin main
```

#### 4. Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

#### 5. Add Environment Variables

In Vercel Project Settings → Environment Variables:

```env
# Frontend
REACT_APP_BACKEND_URL=https://your-backend-url.com

# Backend (if using Vercel for backend)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/engitech
DB_NAME=engitech
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@engitech.com
ADMIN_PASSWORD=admin123
CORS_ORIGINS=*
```

#### 6. Deploy Backend

**Option A: Vercel Serverless (Simple)**
- Backend will auto-deploy with frontend
- API available at `/api/*`

**Option B: Railway (Better for Backend)**
1. Go to [Railway.app](https://railway.app)
2. Deploy from GitHub
3. Add same environment variables
4. Get your backend URL
5. Update `REACT_APP_BACKEND_URL` in Vercel

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Shadcn UI
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **Authentication:** JWT with httpOnly cookies
- **Animations:** Framer Motion, Custom SVG animations

## 🔐 Admin Access

- **Email:** admin@engitech.com
- **Password:** admin123

## 📱 Features Overview

### For Students
- Browse equipment by branch
- Filter by year and semester
- Search across all equipment
- Bookmark favorites
- View detailed information:
  - Definition
  - Working principle
  - Main parts
  - Applications
  - Exam notes

### For Admins
- Add new equipment
- Edit existing equipment
- Delete equipment
- Manage database through UI

## 🎨 Design

- Swiss brutalist aesthetic
- Custom color palette per branch:
  - Mechanical: Blue (#002FA7)
  - Electrical: Red (#FF3B30)
  - Civil: Yellow (#FFD60A)
  - Electronics: Green (#28A745)
- Animated SVG elements (gears, circuits, blueprints, waves)
- Smooth transitions and micro-interactions

## 📊 Equipment Coverage

- **Mechanical:** 21 machines (Lathe, CNC, Milling, Grinding, etc.)
- **Electrical:** 21 machines (Transformers, Motors, Generators, etc.)
- **Civil:** 21 machines (Theodolite, Total Station, Compactor, etc.)
- **Electronics:** 20 machines (Oscilloscope, Function Generator, etc.)

## 🤝 Contributing

Created and maintained by **Anuj Kumar**

## 📄 License

© 2026 EngiTech. Developed by Anuj Kumar

---

**Built for engineering students** 🎓

For support or queries, contact: anujkumar170705@gmail.com
