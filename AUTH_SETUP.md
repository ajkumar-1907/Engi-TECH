# Auth Setup — Google/GitHub Login, Email Verification, Password Reset

## 0. Rotate your leaked secrets first

`VERCEL_ENV_VARIABLES.md` in this repo has a real MongoDB password, JWT secret,
and admin password sitting in plaintext. Do this before anything else:

1. **MongoDB Atlas** → Database Access → edit the `anujkumar170705_db_user` user → reset password.
   Update `MONGO_URL` everywhere it's used (local `.env`, Vercel env vars).
2. **JWT_SECRET** → generate a new one: `openssl rand -hex 32`
3. **ADMIN_PASSWORD** → change from `admin123` to something real.
4. Delete the actual values from `VERCEL_ENV_VARIABLES.md` (keep it as a checklist of
   *names* only) and set them exclusively in Vercel's dashboard.
5. If this repo is/was public on GitHub, treat the old Mongo password as
   compromised even after rotating — assume it was scraped.

## 1. Google Sign-In

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create/select a project.
2. **APIs & Services → OAuth consent screen** → configure it (External, add your app name/logo).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins: your frontend URL(s), e.g.
     `http://localhost:3000` and `https://engi-tech-1auw-one.vercel.app`
   - You do **not** need a redirect URI — this flow uses the client-side
     Sign In With Google button, not a server redirect.
4. Copy the **Client ID**.

**Env vars:**
```env
# Backend
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

# Frontend
REACT_APP_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

## 2. GitHub Sign-In

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Homepage URL: your frontend URL.
3. Authorization callback URL: `https://your-frontend-url/auth/github/callback`
   (use `http://localhost:3000/auth/github/callback` for local dev — you'll
   need a separate GitHub OAuth App per environment since GitHub only allows
   one callback URL per app).
4. Generate a **Client Secret**.

**Env vars:**
```env
# Backend
GITHUB_CLIENT_ID=xxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxx
GITHUB_REDIRECT_URI=https://your-frontend-url/auth/github/callback

# Frontend
REACT_APP_GITHUB_CLIENT_ID=xxxxxxxx
REACT_APP_GITHUB_REDIRECT_URI=https://your-frontend-url/auth/github/callback
```

Note: `GITHUB_REDIRECT_URI` (backend) and `REACT_APP_GITHUB_REDIRECT_URI`
(frontend) must be **identical** — GitHub checks it on the token exchange.

## 3. Resend (verification + reset emails)

1. Sign up at [resend.com](https://resend.com) → free tier is enough to start.
2. Grab an API key from the dashboard.
3. Until you verify a domain, Resend only lets you send **to the email
   address you signed up with** — fine for testing the flow yourself, not
   for real users. Verify a domain (Resend → Domains) before launch.

**Env vars:**
```env
# Backend
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=EngiTech <onboarding@resend.dev>   # or your verified domain sender
FRONTEND_URL=https://your-frontend-url                # used to build email links
```

## 4. Install new dependencies

```bash
cd backend
pip install -r requirements.txt --break-system-packages   # adds google-auth, httpx, resend
```

Frontend needs nothing new installed — Google's script is loaded via a
`<script>` tag in `public/index.html`, and GitHub's flow is a plain redirect.

## 5. What changed, in short

**Backend (`backend/server.py`, `backend/email_service.py`)**
- `POST /api/auth/google` — verifies a Google ID token, logs in or creates a user
- `POST /api/auth/github` — exchanges a GitHub OAuth code, logs in or creates a user
- `POST /api/auth/forgot-password` / `POST /api/auth/reset-password` — token-based reset, tokens stored hashed, 30-min expiry
- `POST /api/auth/verify-email` / `POST /api/auth/resend-verification` — 24h-expiry verification tokens
- `users` collection gains: `is_verified`, `oauth_provider`, `oauth_id`, `avatar_url`; `password_hash` is now nullable (OAuth-only accounts)
- New collections: `password_resets`, `email_verifications`
- If someone registered with a password and later signs in with Google/GitHub using the same email, the accounts are linked automatically (matched by email)

**Frontend**
- `AuthPage.js` — Google button (renders via Google Identity Services) + GitHub button (redirect flow), "Forgot password?" link
- New pages: `ForgotPasswordPage`, `ResetPasswordPage`, `VerifyEmailPage`, `GithubCallbackPage`
- `AuthContext.js` — adds `googleLogin`, `githubLogin`, `forgotPassword`, `resetPassword`, `verifyEmail`, `resendVerification`

## 6. Testing locally

1. Set all the env vars above in `backend/.env` and `frontend/.env`.
2. `GITHUB_REDIRECT_URI` / `REACT_APP_GITHUB_REDIRECT_URI` → `http://localhost:3000/auth/github/callback`
3. Google origin → add `http://localhost:3000` to the OAuth client's authorized origins.
4. Register a normal account, check your Resend-registered email for the verification link, confirm `/verify-email?token=...` works.
5. Use "Forgot password?" and confirm the reset email + `/reset-password?token=...` flow.
6. Try both social buttons.

## Note on the existing `require_admin` / role system

Nothing here changes admin logic — OAuth and password-reset users are always
created with `role: "user"`. Promote to admin manually in MongoDB (or build an
admin-only endpoint for it later) same as before.
