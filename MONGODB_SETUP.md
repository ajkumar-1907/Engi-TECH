# MongoDB Atlas Setup Instructions

## Your MongoDB Connection Details

**Connection String Template:**
```
mongodb+srv://anujkumar170705_db_user:<YOUR_PASSWORD>@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0
```

## Steps to Complete Setup:

### 1. Replace <YOUR_PASSWORD> with your actual MongoDB password

Example: If your password is `MySecurePass123`, the string becomes:
```
mongodb+srv://anujkumar170705_db_user:MySecurePass123@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Important MongoDB Atlas Settings

Go to your MongoDB Atlas Dashboard:

#### Network Access (CRITICAL!)
1. Click **Network Access** in left sidebar
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

Why? This allows Vercel/Railway to connect to your database.

#### Database Access
1. Click **Database Access**
2. Make sure `anujkumar170705_db_user` has:
   - **Database User Privileges:** Read and write to any database
   - **Built-in Role:** Atlas admin (or at least readWrite)

### 3. Test Connection Locally

Once you have your password, test it:

```bash
# Replace YOUR_PASSWORD with actual password
mongosh "mongodb+srv://anujkumar170705_db_user:YOUR_PASSWORD@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority"
```

If connection works, you'll see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb+srv://...
Using MongoDB: ...
```

### 4. Update Environment Files

#### For Local Development:
Update `/app/backend/.env`:
```env
MONGO_URL="mongodb+srv://anujkumar170705_db_user:YOUR_PASSWORD@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="engitech"
```

#### For Vercel Deployment:
Add in Vercel Dashboard → Settings → Environment Variables:
```
MONGO_URL=mongodb+srv://anujkumar170705_db_user:YOUR_PASSWORD@cluster0.fun0itq.mongodb.net/engitech?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=engitech
```

### 5. Seed Your Database (First Time Only)

After updating the .env file:

```bash
cd /app/backend
python seed_comprehensive_equipment.py
```

This will populate your MongoDB Atlas with all 83 equipment!

## Security Notes

⚠️ **NEVER commit your password to GitHub!**
- Always use environment variables
- Add `.env` to `.gitignore`
- For Vercel/Railway, add secrets in their dashboard

## Troubleshooting

### "Authentication failed"
- Double-check password (no spaces, correct case)
- Make sure user exists in Database Access

### "Connection timeout"
- Check Network Access whitelist
- Make sure 0.0.0.0/0 is added

### "Database not found"
- Database will be auto-created on first connection
- Just make sure DB_NAME="engitech" is set

## Next Steps

1. ✅ Get your MongoDB password
2. ✅ Whitelist 0.0.0.0/0 in Network Access
3. ✅ Update connection string with password
4. ✅ Test connection
5. ✅ Seed database with equipment
6. ✅ Deploy to Vercel

---

**Your Database Info:**
- Username: `anujkumar170705_db_user`
- Cluster: `cluster0.fun0itq.mongodb.net`
- Database Name: `engitech`
- Total Equipment: 83 items

Created by Anuj Kumar
