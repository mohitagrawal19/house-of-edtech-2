# MongoDB Atlas Setup for Netlify Deployment

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new project

## Step 2: Create a Database Cluster
1. Click **"Create"** → **"Cluster"**
2. Choose **"M0 Sandbox"** (Free tier)
3. Select your region
4. Click **"Create"**
5. Wait for cluster to deploy (5-10 minutes)

## Step 3: Create Database User
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Enter username and password (save these!)
4. Set privileges to **"Read and write to any database"**
5. Click **"Add User"**

## Step 4: Setup Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (or specific IPs)
4. Confirm

## Step 5: Get Connection String
1. Click **"Connect"** button on cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Replace `<database-name>` with your database name (e.g., "house-of-edtech")

Example:
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/house-of-edtech
```

## Step 6: Update Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Click **"Site Settings"** → **"Build & Deploy"** → **"Environment"**
3. Add the following variables:

### Required Variables:
```
MONGODB_URI = "mongodb+srv://username:password@your-cluster.mongodb.net/house-of-edtech"
JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production-12345"
JWT_EXPIRY = "7d"
NODE_ENV = "production"
SECURE_COOKIES = "true"
```

### Application URLs (update after you know your Netlify domain):
```
NEXT_PUBLIC_API_URL = "https://your-site-name.netlify.app/api"
NEXT_PUBLIC_APP_URL = "https://your-site-name.netlify.app"
```

## Step 7: Redeploy
After adding environment variables:
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"**
3. Wait for build to complete

## Testing
After deployment:
1. Go to your Netlify URL
2. Try to register a new user
3. Try to login
4. Check if data is saved in MongoDB Atlas

## Troubleshooting

### "Connection timeout" error
- Check MongoDB Atlas whitelist settings
- Verify connection string is correct
- Make sure database user has correct permissions

### "Authentication failed" error
- Double-check username and password in connection string
- Ensure special characters are URL-encoded (@ → %40)
- Verify user exists in Database Access

### "Database not found" error
- Ensure database name matches in connection string
- Create the database in MongoDB Atlas if it doesn't exist

## Security Notes
- Never commit actual passwords to git
- Use environment variables for secrets
- Generate a strong JWT_SECRET (at least 32 characters)
- Use HTTPS URLs (https://, not http://)
- Keep database credentials private
