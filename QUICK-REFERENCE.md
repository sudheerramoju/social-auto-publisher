# ⚡ Quick Reference Card

## 🚀 Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## 📋 Essential Commands

### Installation
```bash
./install.sh                    # One-command setup
```

### Backend
```bash
npm install                     # Install dependencies
npm run dev                     # Development mode
npm start                       # Production mode
```

### Frontend
```bash
npm install                     # Install dependencies
npm start                       # Development mode
npm run build                   # Production build
```

---

## 🔑 API Credentials

Edit `backend/.env`:

```env
# Facebook & Instagram
FACEBOOK_PAGE_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx

# LinkedIn
LINKEDIN_ACCESS_TOKEN=xxx
LINKEDIN_PERSON_ID=urn:li:person:xxx

# Twitter
TWITTER_API_KEY=xxx
TWITTER_ACCESS_TOKEN=xxx

# YouTube
YOUTUBE_API_KEY=xxx
YOUTUBE_ACCESS_TOKEN=xxx

# WordPress
WORDPRESS_SITE_URL=https://yourblog.com
WORDPRESS_USERNAME=your_username
WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx
```

---

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# WordPress posts
curl "http://localhost:5000/api/wordpress/posts?siteUrl=https://yourblog.com&username=user&appPassword=pass"

# Create post (replace with your data)
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=Test post" \
  -F "blogUrl=https://yourblog.com" \
  -F 'platforms=["facebook"]'
```

---

## 📱 Supported Platforms

| Platform | Requires | Features |
|----------|----------|----------|
| Facebook | Page Access Token | Text, Images, Videos, Links |
| Instagram | Business Account | Images, Carousel, Stories |
| LinkedIn | OAuth Token | Text, Images, Articles |
| Twitter | API Keys | Text (280 chars), Images |
| YouTube | Video URL | Comments, Description |

---

## 🎯 Key Features

✅ Post to 5 platforms at once
✅ WordPress blog integration  
✅ Media upload (image/video)
✅ Auto-generate captions
✅ Real-time results
✅ Mobile responsive

---

## 📊 Project Structure

```
social-auto-publisher/
├── backend/src/
│   ├── services/         # Platform APIs
│   ├── routes/           # API endpoints
│   └── server.js         # Main server
├── frontend/src/
│   └── App.js            # Dashboard UI
├── README.md             # Full guide
├── DEPLOYMENT.md         # Deploy guide
└── API-TESTING.md        # Test guide
```

---

## 🐛 Common Issues

**502 Error:**
```bash
pm2 status                # Check if backend running
pm2 restart all           # Restart services
```

**CORS Error:**
```env
FRONTEND_URL=http://localhost:3000
```

**Upload Fails:**
```bash
mkdir -p backend/uploads  # Create uploads dir
chmod 755 backend/uploads # Set permissions
```

---

## 📚 Documentation Files

1. **README.md** - Setup & configuration
2. **DEPLOYMENT.md** - Production deployment
3. **API-TESTING.md** - Testing examples
4. **PROJECT-OVERVIEW.md** - Business strategy
5. **QUICK-REFERENCE.md** - This file

---

## 🚢 Deploy to Production

### Option 1: VPS (DigitalOcean)
```bash
git clone <repo>
cd social-auto-publisher/backend
npm install --production
pm2 start src/server.js
```

### Option 2: Netlify (Frontend)
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Option 3: Heroku (Backend)
```bash
cd backend
heroku create
git push heroku main
```

---

## 💰 Pricing Ideas

| Plan | Price | Posts | Platforms |
|------|-------|-------|-----------|
| Free | $0 | 10/mo | 3 |
| Basic | $19 | 100/mo | 5 |
| Pro | $49 | ∞ | 5 |
| Agency | $99 | ∞ | 5 + Multi-user |

---

## 🎯 Next Steps

1. ✅ Install locally
2. ✅ Get API credentials  
3. ✅ Test each platform
4. ✅ Customize branding
5. ✅ Deploy to production
6. ✅ Launch marketing
7. ✅ Onboard users

---

## 🔗 Important Links

- Facebook Developers: https://developers.facebook.com
- LinkedIn Developers: https://linkedin.com/developers
- Twitter Developers: https://developer.twitter.com
- YouTube API Console: https://console.cloud.google.com
- WordPress REST API: https://developer.wordpress.org/rest-api

---

## 💡 Pro Tips

1. **Start with one platform** - Master it before adding others
2. **Use test accounts** - Don't risk your main accounts
3. **Monitor API limits** - Each platform has rate limits
4. **Cache tokens** - Save refresh tokens securely
5. **Log everything** - Helps debug issues quickly

---

## 🎉 You're Ready!

Everything is set up. Just add your API keys and start posting!

**Questions? Check README.md for detailed guides.**

---

Built for **Visualwits** 🚀
