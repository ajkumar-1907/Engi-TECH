# EngiTech - Product Requirements Document

## Original Problem Statement
Build an app designed for engineering students of core branches (Mechanical, Electrical, Civil, Electronics). It provides important information about different machines and equipment used in each branch. Users can select their branch and explore various equipment. For each equipment, the app shows basic details such as definition, working principle, main parts, applications, and short notes for exams. Requirements: professional modern design for Gen Z engagement, user auth, no flash cards, admin panel to add/edit/preload sample data, searches, bookmarks, backend.

## Tech Stack
- Frontend: React, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: FastAPI (Python)
- Database: MongoDB (local dev) / MongoDB Atlas (production on Vercel)
- Deployment: Vercel (serverless via vercel.json builds+routes)
- Auth: JWT-based with "Remember Me" (30-day persistence)

## User Personas
- **Engineering Students**: Browse equipment by branch/year/semester, bookmark items, search
- **Admin**: Add/edit/delete equipment via admin dashboard

## Core Features — All Implemented & Deployed
1. User Authentication (login, register, remember me, forced login)
2. Branch-based equipment browsing (Mechanical, Electrical, Civil, Electronics)
3. Equipment detail pages (definition, working principle, parts, applications, short notes)
4. Search functionality
5. Bookmarks (per user)
6. Admin Dashboard (CRUD for equipment)
7. Preloaded seed data (83 equipment items — seeded in Atlas)
8. Animated SVG graphics and modern Gen Z design
9. Vercel deployment fully working (vercel.json, CORS, Atlas)
10. Branded as "Created by Anuj Kumar"
11. Health check endpoint (/api/health)
12. **Dark Mode** - Toggle in header, CSS variables, localStorage persistence
13. **Responsive Design** - Mobile hamburger menu, adaptive grids, mobile card layouts for admin
14. **Profile Button** - Avatar with initial, dropdown with name/email/role/links/sign out

## DB Schema
- **users**: {email, hashed_password, name, role, bookmarks}
- **equipment**: {name, definition, working_principle, main_parts, applications, short_notes, branch, year, semester}
- **login_attempts**: {ip_address, attempts, lockout_until}

## Key API Endpoints
- POST /api/auth/register, /api/auth/login, /api/auth/logout
- GET /api/auth/me
- GET, POST, PUT, DELETE /api/equipment
- GET, POST /api/bookmarks, /api/bookmarks/{id}
- GET /api/health

## Deployment Notes
- Local dev uses local MongoDB; Vercel uses MongoDB Atlas
- MongoDB Atlas Network Access: 0.0.0.0/0 (all IPs allowed for Vercel)
- Frontend uses relative URLs (empty string fallback) for Vercel same-domain routing
- Git identity: Anuj Kumar / seinanuj@gmail.com / ajkumar-1907
- Vercel env vars: MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

## Status: COMPLETE — All features live
