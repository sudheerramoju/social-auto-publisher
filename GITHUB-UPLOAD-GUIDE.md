# 📦 GitHub Upload Guide - Social Auto Publisher

## Complete step-by-step guide to upload your project to GitHub

---

## 🎯 Why Upload to GitHub First?

✅ Version control & backup
✅ Easy deployment to Netlify (auto-deploy from GitHub)
✅ Professional portfolio piece
✅ Collaboration ready
✅ Open source potential

---

## 📋 STEP-BY-STEP GUIDE

### Step 1: Install Git (If Not Already Installed)

**Check if Git is installed:**
```bash
git --version
```

**If not installed:**

**Windows:**
- Download from https://git-scm.com/download/win
- Run installer with default settings

**macOS:**
```bash
brew install git
# OR
xcode-select --install
```

**Ubuntu/Linux:**
```bash
sudo apt-get update
sudo apt-get install git
```

---

### Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verify:**
```bash
git config --list
```

---

### Step 3: Create GitHub Account (If You Don't Have One)

1. Go to https://github.com
2. Click "Sign Up"
3. Choose free plan
4. Verify your email

---

### Step 4: Create a New Repository on GitHub

**Option A: Via GitHub Website (Easiest)**

1. Go to https://github.com
2. Click the **"+"** icon (top right)
3. Select **"New repository"**
4. Fill in details:
   - **Repository name:** `social-auto-publisher`
   - **Description:** `Multi-platform social media management tool - Post to Facebook, Instagram, LinkedIn, Twitter & YouTube simultaneously`
   - **Visibility:** 
     - ✅ **Public** (recommended for portfolio)
     - OR **Private** (if you want to keep it secret for now)
   - **Important:** ❌ DO NOT initialize with README, .gitignore, or license
     (We'll add these from your local files)
5. Click **"Create repository"**

**You'll see a page with setup instructions - keep this open!**

---

### Step 5: Prepare Your Local Project

**Navigate to your project:**
```bash
cd social-auto-publisher
```

**Create .gitignore file (IMPORTANT!):**

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables (CRITICAL - Don't expose API keys!)
.env
.env.local
.env.production
.env.development
*.env

# Production builds
frontend/build/
frontend/dist/
backend/dist/

# Uploads (don't commit uploaded files)
backend/uploads/*
!backend/uploads/.gitkeep

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
*.log

# Testing
coverage/
.nyc_output/

# Misc
*.pem
*.key
.cache/
EOF
```

This prevents sensitive data (API keys, node_modules) from being uploaded!

---

### Step 6: Initialize Git in Your Project

```bash
# Initialize Git repository
git init

# Check status
git status
```

You should see a list of untracked files (red color).

---

### Step 7: Create README.md for GitHub

**Create an attractive README:**

```bash
cat > README.md << 'EOF'
# 🚀 Social Auto Publisher

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](YOUR-NETLIFY-URL-HERE)
[![GitHub license](https://img.shields.io/github/license/YOUR-USERNAME/social-auto-publisher.svg)](https://github.com/YOUR-USERNAME/social-auto-publisher/blob/main/LICENSE)

> Multi-platform social media management tool - Post to Facebook, Instagram, LinkedIn, Twitter & YouTube simultaneously

![Social Auto Publisher Dashboard](https://via.placeholder.com/800x400/4F46E5/ffffff?text=Add+Screenshot+Here)

## ✨ Features

- 🚀 **One-Click Multi-Platform Posting** - Publish to 5+ platforms simultaneously
- 📝 **WordPress Integration** - Auto-import your blog posts
- 📅 **Post Scheduling** - Schedule posts for optimal engagement
- 📊 **Analytics Dashboard** - Track performance across all platforms
- 🖼️ **Media Support** - Upload images and videos
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🎯 Supported Platforms

- Facebook
- Instagram
- LinkedIn
- Twitter (X)
- YouTube
- WordPress (integration)

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Axios
- Multer (file uploads)

### APIs Integrated
- Facebook Graph API
- Instagram Graph API
- LinkedIn API v2
- Twitter API v2
- YouTube Data API v3
- WordPress REST API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/social-auto-publisher.git
cd social-auto-publisher
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables
```bash
cd backend
cp .env.example .env
# Edit .env with your API credentials
```

4. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

5. Open http://localhost:3000

## 📖 Documentation

- [Complete Setup Guide](README.md)
- [API Credentials Setup](README.md#api-setup)
- [Deployment Guide](DEPLOYMENT.md)
- [Free Backend Hosting](FREE-BACKEND-HOSTING.md)
- [API Testing Guide](API-TESTING.md)

## 🔑 API Credentials Setup

You'll need API credentials from:
- [Facebook Developers](https://developers.facebook.com/)
- [LinkedIn Developers](https://www.linkedin.com/developers/)
- [Twitter Developer Portal](https://developer.twitter.com/)
- [Google Cloud Console](https://console.cloud.google.com/) (for YouTube)

See [README.md](README.md) for detailed setup instructions.

## 🚢 Deployment

### Free Deployment Options

**Frontend:**
- Netlify (Recommended) - Free
- Vercel - Free
- GitHub Pages - Free

**Backend:**
- Railway - $5 credit/month (Free)
- Render - Free forever
- Cyclic - Free

See [DEPLOYMENT.md](DEPLOYMENT.md) and [FREE-BACKEND-HOSTING.md](FREE-BACKEND-HOSTING.md) for complete guides.

## 💰 Pricing (If You Run as SaaS)

- **Free Plan**: 10 posts/month, 3 platforms
- **Basic Plan**: $19/month - 100 posts, all platforms
- **Pro Plan**: $49/month - Unlimited posts
- **Agency Plan**: $99/month - Multi-user access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name** - [Visualwits](https://linkedin.com/in/YOUR-PROFILE)

- LinkedIn: [@yourprofile](https://linkedin.com/in/YOUR-PROFILE)
- Twitter: [@yourhandle](https://twitter.com/YOUR-HANDLE)
- Website: [yourdomain.com](https://yourdomain.com)

## 🙏 Acknowledgments

- Built with React and Node.js
- Icons by Lucide React
- Styling with Tailwind CSS
- Deployed on Netlify & Railway

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by Visualwits**
EOF
```

**Important:** Replace placeholders:
- `YOUR-USERNAME` with your GitHub username
- `YOUR-NETLIFY-URL-HERE` with your live URL (after deployment)
- Add your social media links
- Add a screenshot later

---

### Step 8: Add All Files to Git

```bash
# Add all files
git add .

# Check what will be committed
git status
```

You should see files in green (staged for commit).

**Verify .env is NOT listed** (it should be ignored by .gitignore)

---

### Step 9: Create Your First Commit

```bash
git commit -m "Initial commit: Social Auto Publisher v1.0

- Complete React frontend with dashboard UI
- Node.js/Express backend with 6 API integrations
- Facebook, Instagram, LinkedIn, Twitter, YouTube, WordPress support
- Multi-platform posting functionality
- Media upload support
- Comprehensive documentation
- Ready for deployment"
```

---

### Step 10: Connect to GitHub Repository

**Copy the commands from your GitHub repository page, they look like:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/social-auto-publisher.git
git branch -M main
git push -u origin main
```

**If you have SSH set up, use:**
```bash
git remote add origin git@github.com:YOUR-USERNAME/social-auto-publisher.git
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

---

### Step 11: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR-USERNAME/social-auto-publisher`
2. You should see all your files!
3. Check that `.env` is NOT there (good - it's private!)

---

## 🎉 SUCCESS! Your Code is on GitHub!

Now your repository URL is:
```
https://github.com/YOUR-USERNAME/social-auto-publisher
```

---

## 📸 Step 12: Make Your GitHub Repo Look Professional

### Add Topics (Tags)

1. Go to your repo on GitHub
2. Click the ⚙️ gear icon next to "About"
3. Add topics:
   ```
   react, nodejs, social-media, saas, api-integration, 
   facebook-api, instagram-api, linkedin-api, twitter-api, 
   youtube-api, wordpress, automation, netlify
   ```

### Add Description

In the same "About" section:
```
🚀 Multi-platform social media management tool - Post to Facebook, 
Instagram, LinkedIn, Twitter & YouTube simultaneously. Built with 
React & Node.js.
```

### Add Website URL

After deploying to Netlify, add your live URL here.

---

## 📱 Step 13: Add a Screenshot

**After deploying:**

1. Take a nice screenshot of your dashboard
2. Name it `screenshot.png`
3. Upload to GitHub:
```bash
git add screenshot.png
git commit -m "Add dashboard screenshot"
git push
```

4. Update README.md:
   - Replace placeholder image URL with:
   ```
   ![Dashboard](screenshot.png)
   ```

---

## 🔄 Future Updates (How to Push Changes)

**After making any changes:**

```bash
# See what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## 🚀 Step 14: Deploy to Netlify from GitHub

**Now you can deploy easily:**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose **GitHub**
4. Select your `social-auto-publisher` repository
5. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
6. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL
7. Click **Deploy**!

**Netlify will auto-deploy every time you push to GitHub!** ✨

---

## 📝 Common Git Commands

```bash
# Check status
git status

# See commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# See remote URL
git remote -v
```

---

## 🛡️ SECURITY CHECKLIST

Before pushing, verify:

- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] `.env.example` has placeholder values only
- [ ] `node_modules/` is ignored
- [ ] Sensitive uploads are ignored

---

## ❌ Common Mistakes to Avoid

1. **DON'T commit .env file**
   - If you did: Remove it immediately
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from tracking"
   git push
   ```

2. **DON'T commit node_modules**
   - If you did: Add to .gitignore and remove
   ```bash
   git rm -r --cached node_modules
   git commit -m "Remove node_modules"
   git push
   ```

3. **DON'T expose API keys**
   - If you did: Regenerate all API keys immediately!

---

## 🎯 After GitHub Upload

**Next steps:**

1. ✅ Deploy backend to Railway/Render
2. ✅ Deploy frontend to Netlify (from GitHub)
3. ✅ Test live application
4. ✅ Add screenshot to README
5. ✅ Update README with live URLs
6. ✅ Create LinkedIn post
7. ✅ Share your GitHub repo!

---

## 💡 Pro Tips

### Make Your Repo Stand Out:

1. **Add a LICENSE file:**
```bash
# MIT License is most common
curl https://raw.githubusercontent.com/licenses/license-templates/master/templates/mit.txt > LICENSE
# Edit with your name and year
git add LICENSE
git commit -m "Add MIT license"
git push
```

2. **Add GitHub badges to README:**
```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/social-auto-publisher)
![GitHub forks](https://img.shields.io/github/forks/YOUR-USERNAME/social-auto-publisher)
![GitHub issues](https://img.shields.io/github/issues/YOUR-USERNAME/social-auto-publisher)
```

3. **Pin repository to your profile:**
   - Go to your GitHub profile
   - Click "Customize your pins"
   - Select this repo

---

## 🎉 YOU'RE DONE!

Your code is now on GitHub and ready to:
- ✅ Deploy to Netlify
- ✅ Share in your portfolio
- ✅ Collaborate with others
- ✅ Show to potential employers/clients
- ✅ Include in LinkedIn post

---

## 📞 Troubleshooting

### "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH
```bash
git remote set-url origin https://github.com/YOUR-USERNAME/social-auto-publisher.git
git push
```

### "Repository not found"

**Solution:** Check URL is correct
```bash
git remote -v
# If wrong, update:
git remote set-url origin https://github.com/YOUR-USERNAME/social-auto-publisher.git
```

### "Unrelated histories" error

**Solution:**
```bash
git pull origin main --allow-unrelated-histories
git push
```

### Files not showing on GitHub

**Solution:** Check .gitignore isn't blocking them
```bash
git check-ignore -v filename
```

---

## 🎊 Celebrate!

You've just:
✅ Learned Git & GitHub
✅ Uploaded your first major project
✅ Made it ready for deployment
✅ Set up for continuous deployment

**You're officially a developer with an online portfolio!** 🚀

---

**Ready for the next step? Deploy to Netlify!**

See: [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md)
