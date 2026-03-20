# 🚀 Complete Netlify Deployment Guide

## Overview

Since Netlify is primarily for **frontend hosting**, we'll use a two-part deployment:
- **Frontend** → Netlify (Free)
- **Backend** → Heroku/Railway/Render (Free tier available)

---

## 📋 Prerequisites

1. GitHub account (to connect repository)
2. Netlify account (sign up at https://netlify.com)
3. Heroku account for backend (sign up at https://heroku.com) OR Railway/Render

---

## 🎯 Deployment Strategy

### Architecture
```
User Browser
    ↓
Netlify (Frontend) → https://your-app.netlify.app
    ↓
Heroku (Backend) → https://your-api.herokuapp.com
    ↓
Social Media APIs (Facebook, Twitter, etc.)
```

---

## Part 1: Deploy Backend to Heroku (FREE)

### Step 1: Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Ubuntu/Debian:**
```bash
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
```

**Windows:**
Download from https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
cd social-auto-publisher/backend
heroku create your-social-api
# This creates: https://your-social-api.herokuapp.com
```

### Step 4: Set Environment Variables

```bash
# Set all your API credentials
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Facebook & Instagram
heroku config:set FACEBOOK_APP_ID=your_app_id
heroku config:set FACEBOOK_APP_SECRET=your_app_secret
heroku config:set FACEBOOK_PAGE_ACCESS_TOKEN=your_token
heroku config:set INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_id

# LinkedIn
heroku config:set LINKEDIN_CLIENT_ID=your_client_id
heroku config:set LINKEDIN_CLIENT_SECRET=your_client_secret
heroku config:set LINKEDIN_ACCESS_TOKEN=your_token
heroku config:set LINKEDIN_PERSON_ID=urn:li:person:your_id

# Twitter
heroku config:set TWITTER_API_KEY=your_key
heroku config:set TWITTER_API_SECRET=your_secret
heroku config:set TWITTER_ACCESS_TOKEN=your_token
heroku config:set TWITTER_ACCESS_SECRET=your_secret

# YouTube
heroku config:set YOUTUBE_API_KEY=your_key
heroku config:set YOUTUBE_CLIENT_ID=your_client_id
heroku config:set YOUTUBE_CLIENT_SECRET=your_secret
heroku config:set YOUTUBE_ACCESS_TOKEN=your_token
heroku config:set YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Frontend URL (will set this after deploying frontend)
heroku config:set FRONTEND_URL=https://your-app.netlify.app
```

### Step 5: Update Backend package.json

Make sure your `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node src/server.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

### Step 6: Deploy Backend

```bash
cd backend

# Initialize git if not already
git init
heroku git:remote -a your-social-api

# Commit and deploy
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

### Step 7: Test Backend

```bash
# Check if it's running
heroku logs --tail

# Test the API
curl https://your-social-api.herokuapp.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Social Auto Publisher API is running",
  "version": "1.0.0"
}
```

---

## Part 2: Deploy Frontend to Netlify

### Method A: Via Netlify Dashboard (Easiest)

#### Step 1: Push to GitHub

```bash
cd social-auto-publisher

# Initialize git (if not already)
git init

# Add all files
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
# Go to github.com → New Repository → "social-auto-publisher"
git remote add origin https://github.com/YOUR_USERNAME/social-auto-publisher.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your **social-auto-publisher** repository
5. Configure build settings:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

6. Add **Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-social-api.herokuapp.com/api`

7. Click **"Deploy site"**

#### Step 3: Wait for Deployment

Netlify will:
- Install dependencies
- Build your React app
- Deploy to a URL like: `https://random-name-123456.netlify.app`

#### Step 4: Custom Domain (Optional)

1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration steps
5. Netlify auto-provides **free SSL** certificate!

---

### Method B: Via Netlify CLI (Alternative)

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Build Frontend

```bash
cd frontend

# Update API URL in .env
echo "REACT_APP_API_URL=https://your-social-api.herokuapp.com/api" > .env.production

# Build
npm install
npm run build
```

#### Step 4: Deploy

```bash
# Deploy to production
netlify deploy --prod

# Follow prompts:
# - Create & configure new site: Yes
# - Publish directory: build
```

#### Step 5: Get Your URL

Netlify will provide a URL like:
```
https://your-app-name.netlify.app
```

---

## Part 3: Update CORS Configuration

### Update Backend CORS

Go back to Heroku and update the FRONTEND_URL:

```bash
heroku config:set FRONTEND_URL=https://your-app-name.netlify.app
```

Or edit your `backend/src/server.js` and redeploy:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.netlify.app',
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

Then redeploy:
```bash
cd backend
git add .
git commit -m "Update CORS"
git push heroku main
```

---

## 🧪 Test Your Deployment

### Test Backend
```bash
curl https://your-social-api.herokuapp.com/api/health
```

### Test Frontend
1. Open: `https://your-app-name.netlify.app`
2. Try creating a post
3. Check if it connects to backend
4. Verify social media posting works

---

## 🎨 Customize Your Netlify Site

### Custom Site Name

In Netlify dashboard:
1. **Site settings** → **General** → **Site details**
2. **Change site name**: `social-auto-publisher` (if available)
3. Your URL becomes: `https://social-auto-publisher.netlify.app`

### Environment Variables

Add more environment variables in Netlify:
1. **Site settings** → **Environment variables**
2. Add any frontend-specific configs

---

## 🔒 Security Checklist

After deployment:

- [ ] All API keys stored in Heroku config vars (not in code)
- [ ] CORS properly configured for your Netlify domain
- [ ] SSL/HTTPS enabled (automatic with Netlify)
- [ ] Test all platform integrations work in production
- [ ] Monitor Heroku logs for errors
- [ ] Set up error tracking (optional: Sentry)

---

## 💰 Cost Breakdown

### Free Tier Limits

**Netlify (Free):**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Free SSL
- ✅ Custom domain support
- ✅ Automatic deployments

**Heroku (Free - Eco Dyno $5/month):**
- ✅ 1000 dyno hours/month
- ✅ Custom domain
- ✅ Automatic SSL
- ⚠️ Sleeps after 30 min inactivity

**Total Cost: $5/month for production**

---

## 🚀 Alternative Backend Hosts (FREE)

### Option 1: Railway (Recommended)

1. Go to https://railway.app
2. **"New Project"** → **"Deploy from GitHub"**
3. Select backend folder
4. Add environment variables
5. Deploy!

**Benefits:**
- $5 free credit/month
- No sleep mode
- Easier than Heroku

### Option 2: Render

1. Go to https://render.com
2. **"New"** → **"Web Service"**
3. Connect GitHub repo
4. Root directory: `backend`
5. Build: `npm install`
6. Start: `node src/server.js`
7. Add environment variables
8. Deploy!

**Benefits:**
- Free tier (with limitations)
- No sleep on paid plan ($7/month)

### Option 3: Vercel (Full-Stack)

Deploy both frontend and backend on Vercel:

```bash
npm install -g vercel
cd social-auto-publisher
vercel --prod
```

Configure `vercel.json` (already included in project)

---

## 📊 Monitoring Your Deployment

### Check Netlify Logs

1. Netlify Dashboard → Your site
2. **"Deploys"** tab
3. Click latest deploy → **"Deploy log"**

### Check Heroku Logs

```bash
heroku logs --tail --app your-social-api
```

### Check Application Health

```bash
# Backend health
curl https://your-social-api.herokuapp.com/api/health

# Frontend (should return HTML)
curl https://your-app-name.netlify.app
```

---

## 🐛 Common Deployment Issues

### Issue 1: Build Fails on Netlify

**Solution:**
```bash
# Ensure build command is correct
# In Netlify: Build command should be "npm run build"
# Publish directory should be "frontend/build"
```

### Issue 2: CORS Error

**Solution:**
```bash
# Update backend CORS
heroku config:set FRONTEND_URL=https://your-app-name.netlify.app
```

### Issue 3: API Not Responding

**Solution:**
```bash
# Check Heroku logs
heroku logs --tail

# Ensure backend is running
heroku ps

# Restart if needed
heroku restart
```

### Issue 4: Environment Variables Not Working

**Solution:**
```bash
# Check if vars are set
heroku config

# Re-set if needed
heroku config:set VARIABLE_NAME=value
```

---

## 🎉 You're Live!

### Your URLs:
- **Frontend**: https://your-app-name.netlify.app
- **Backend API**: https://your-social-api.herokuapp.com
- **API Health**: https://your-social-api.herokuapp.com/api/health

### Share Your App:
```
🚀 Social Auto Publisher
Post to Facebook, Instagram, LinkedIn, Twitter & YouTube - all at once!

Try it now: https://your-app-name.netlify.app
```

---

## 📈 Next Steps After Deployment

1. **Test thoroughly** - Try posting to all platforms
2. **Set up analytics** - Google Analytics, Hotjar
3. **Add custom domain** - Professional look
4. **Marketing** - Share with target audience
5. **Gather feedback** - Improve based on user input
6. **Scale** - Upgrade Heroku when needed

---

## 💡 Pro Tips

1. **Auto-Deploy**: Push to GitHub → Auto deploys to Netlify
2. **Preview Deploys**: Netlify creates preview for each PR
3. **Rollback**: Easy one-click rollback in Netlify dashboard
4. **Performance**: Netlify CDN makes your site super fast
5. **Functions**: Use Netlify Functions for serverless backend (advanced)

---

## 📞 Support Resources

- Netlify Docs: https://docs.netlify.com
- Heroku Docs: https://devcenter.heroku.com
- Community: https://answers.netlify.com

---

**Congratulations! Your Social Auto Publisher is now LIVE! 🎊**

Share your deployment URL - I'd love to see it running!
