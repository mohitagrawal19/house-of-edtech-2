# Netlify Deployment Guide for House of EdTech

## Prerequisites

Before deploying to Netlify, ensure you have:
- A GitHub account with your repository pushed
- A Netlify account (free tier available at https://netlify.com)
- MongoDB Atlas database set up with connection string
- JWT_SECRET and other environment variables ready

## Deployment Steps

### 1. Connect Your Repository to Netlify

1. Go to https://app.netlify.com
2. Click **"New site from Git"**
3. Choose **"GitHub"** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the **house-of-edtech-2** repository
6. Choose the **mohit/dev/houseofedtech** branch

### 2. Configure Build Settings

The build settings should be auto-detected:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions`

If not auto-detected, set them manually.

### 3. Set Environment Variables

Click **"Site Settings"** → **"Build & Deploy"** → **"Environment variables"** and add:

#### Required Variables:
```
MONGODB_URI = "your_mongodb_atlas_connection_string"
JWT_SECRET = "your_jwt_secret_key"
JWT_EXPIRY = "7d"
```

#### Recommended Variables:
```
NEXT_PUBLIC_API_URL = "https://your-site-name.netlify.app"
NEXT_PUBLIC_APP_URL = "https://your-site-name.netlify.app"
NODE_ENV = "production"
```

### 4. Database Configuration

If using MongoDB Atlas:
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Create a database user for production
3. Whitelist Netlify's IP ranges or use "Allow access from anywhere" (0.0.0.0/0)
4. Copy the connection string
5. Add MONGODB_URI to Netlify environment variables

### 5. Deploy

Click **"Deploy site"** and wait for the build to complete.

Build duration: ~2-3 minutes

### 6. Monitor Build Logs

- Go to **Deploys** tab
- Click the latest deployment
- Check logs if there are any errors
- Fix issues and push to GitHub - Netlify will auto-redeploy

## Important Notes

### API Routes
Your Next.js API routes (`/api/*`) will run as Netlify Functions automatically. No additional configuration needed.

### Static Assets
- Next.js static files are cached with long TTL (1 year)
- Ensure proper Cache-Control headers are set in next.config.js

### Environment Variables
- Prefix with `NEXT_PUBLIC_` only for variables needed on the frontend
- Backend-only variables should not have this prefix
- Changes to environment variables require a manual redeploy

### Cold Starts
- First request after deployment may be slower (1-2 seconds)
- Subsequent requests are cached

### Limitations
- Serverless functions have execution timeout (~30 seconds)
- Database queries should be optimized
- File uploads limited to request size limits

## Troubleshooting

### Build Fails
```
npm ci
npm run build
```
Check logs for specific errors.

### API Routes Not Working
Ensure MongoDB URI is correct and database is accessible.

### Environment Variables Not Loading
- Clear browser cache
- Verify variables are added to correct environment
- Redeploy the site

### Database Connection Timeout
- Check MongoDB Atlas whitelist settings
- Verify connection string is correct
- Check network connectivity from Netlify to MongoDB

## Post-Deployment

1. **Test the application:**
   - Register a new user
   - Login with credentials
   - Browse courses
   - Enroll in a course
   - Check student dashboard

2. **Monitor Performance:**
   - Use Netlify Analytics (if enabled)
   - Check function logs in Netlify dashboard
   - Monitor MongoDB Atlas metrics

3. **Set Up Custom Domain (Optional):**
   - Buy a domain or connect existing one
   - Go to Site Settings → Domain Management
   - Follow Netlify's instructions to point DNS

## Rollback

To rollback to a previous deployment:
1. Go to **Deploys** tab
2. Find the previous successful deployment
3. Click **"Publish deploy"**

## Environment-Specific Deployment

For staging/development environments:
1. Create separate Netlify sites for each branch
2. Configure environment variables per site
3. Use different MongoDB databases for each environment

## Next Steps

- Set up CI/CD with GitHub Actions for automated testing
- Configure error tracking (Sentry, LogRocket)
- Set up email notifications for failed builds
- Consider using Netlify Edge Functions for edge caching
