# 🚀 Social Auto Publisher

**A comprehensive multi-platform social media management tool for WordPress bloggers and content creators.**

Built by **Visualwits** - Automate your social media presence across Facebook, Instagram, LinkedIn, Twitter/X, and YouTube.

---

## ✨ Features

### Core Features
- ✅ **Multi-Platform Publishing** - Post to 5+ platforms simultaneously
- 🔄 **WordPress Integration** - Auto-fetch posts from your WordPress blog
- 📅 **Post Scheduling** - Schedule posts for optimal engagement times
- 📊 **Analytics Dashboard** - Track performance across all platforms
- 🖼️ **Media Support** - Images, videos, and GIFs
- 🎯 **Smart Captions** - Auto-generate platform-optimized captions
- 🔗 **Link Management** - Share blog links with automatic shortening

### Supported Platforms
- **Facebook** - Pages and profiles
- **Instagram** - Business accounts (via Facebook Graph API)
- **LinkedIn** - Personal and company pages
- **Twitter (X)** - Standard tweets with media
- **YouTube** - Community posts and video comments

---

## 🏗️ Project Structure

```
social-auto-publisher/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── services/       # Platform API integrations
│   │   │   ├── FacebookService.js
│   │   │   ├── InstagramService.js
│   │   │   ├── LinkedInService.js
│   │   │   ├── TwitterService.js
│   │   │   ├── YouTubeService.js
│   │   │   └── WordPressService.js
│   │   ├── routes/         # API endpoints
│   │   │   ├── posts.js
│   │   │   ├── wordpress.js
│   │   │   ├── platforms.js
│   │   │   ├── analytics.js
│   │   │   └── schedule.js
│   │   ├── models/         # Database models
│   │   └── server.js       # Main server file
│   ├── uploads/            # Temporary media storage
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js         # Main dashboard component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── package.json           # Root package.json
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (optional, for database features)
- API credentials for platforms you want to use

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd social-auto-publisher
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**
```bash
cd ../backend
cp .env.example .env
# Edit .env with your API credentials (see setup guide below)
```

5. **Start the development servers**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 API Credentials Setup

### 1. Facebook & Instagram

Facebook and Instagram share the same Graph API.

**Steps:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add **Facebook Login** and **Instagram Basic Display** products
4. Go to **Graph API Explorer**
5. Select your app and get a **Page Access Token**
6. For Instagram: Connect your Instagram Business account to Facebook Page

**Required Permissions:**
- `pages_manage_posts`
- `pages_read_engagement`
- `instagram_basic`
- `instagram_content_publish`

**Environment Variables:**
```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_business_id
```

**Get Instagram Business Account ID:**
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_PAGE_TOKEN"
# Look for instagram_business_account in response
```

---

### 2. LinkedIn

**Steps:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add **Sign In with LinkedIn** product
4. Request **Share on LinkedIn** permissions
5. Go to **Auth** tab and get credentials

**Required Permissions:**
- `w_member_social`
- `r_liteprofile`

**OAuth 2.0 Flow:**
```bash
# Authorization URL
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=w_member_social%20r_liteprofile

# Exchange code for token
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=YOUR_REDIRECT_URI \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET
```

**Environment Variables:**
```env
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_PERSON_ID=urn:li:person:YOUR_PERSON_ID
```

---

### 3. Twitter (X)

**Steps:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Enable **OAuth 1.0a** in app settings
4. Generate API keys and access tokens

**Required Access Level:**
- Read and Write

**Environment Variables:**
```env
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

**Test Your Credentials:**
```bash
curl -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. YouTube

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create OAuth 2.0 credentials
5. Set redirect URI to your app's callback URL

**Required Scopes:**
- `https://www.googleapis.com/auth/youtube.force-ssl`
- `https://www.googleapis.com/auth/youtubepartner`

**OAuth 2.0 Flow:**
```bash
# Authorization URL
https://accounts.google.com/o/oauth2/v2/auth?
  scope=https://www.googleapis.com/auth/youtube.force-ssl&
  access_type=offline&
  include_granted_scopes=true&
  response_type=code&
  redirect_uri=YOUR_REDIRECT_URI&
  client_id=YOUR_CLIENT_ID

# Exchange code for token
curl -X POST https://oauth2.googleapis.com/token \
  -d code=AUTHORIZATION_CODE \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d redirect_uri=YOUR_REDIRECT_URI \
  -d grant_type=authorization_code
```

**Environment Variables:**
```env
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_ACCESS_TOKEN=your_access_token
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

---

### 5. WordPress

**Steps:**
1. Go to your WordPress admin dashboard
2. Navigate to **Users → Profile**
3. Scroll to **Application Passwords**
4. Create a new application password
5. Save the generated password (it won't be shown again)

**Environment Variables:**
```env
WORDPRESS_SITE_URL=https://yourblog.com
WORDPRESS_USERNAME=your_username
WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

**Test Connection:**
```bash
curl -X GET "https://yourblog.com/wp-json/wp/v2/posts" \
  -u "username:application_password"
```

---

## 📡 API Endpoints

### Posts
- `POST /api/posts/create` - Create and publish post
- `POST /api/posts/schedule` - Schedule a post
- `GET /api/posts/history` - Get post history

### WordPress
- `POST /api/wordpress/connect` - Test WordPress connection
- `GET /api/wordpress/posts` - Fetch recent posts
- `GET /api/wordpress/post/:id` - Get specific post
- `POST /api/wordpress/generate-caption` - Generate caption from post
- `GET /api/wordpress/search` - Search WordPress posts

### Analytics
- `GET /api/analytics` - Get analytics data

### Health Check
- `GET /api/health` - Server health status

---

## 💡 Usage Guide

### Basic Posting Workflow

1. **Write your caption** in the text area
2. **Add blog URL** (optional) to share your article
3. **Upload media** (image/video) if needed
4. **Select platforms** you want to post to
5. **Click "Publish"** and watch it post to all platforms!

### WordPress Integration

1. **Click "Import from WordPress"**
2. **Enter your WordPress credentials**
3. **Select a post** from the list
4. **Caption and URL auto-fill** from your post
5. **Edit and publish** to social media

### Platform-Specific Features

**Instagram:**
- Requires image/video
- Supports carousel posts (multiple images)
- Caption limit: 2,200 characters

**Twitter:**
- Character limit: 280
- Automatically truncates with "..."
- Media is optional

**LinkedIn:**
- Best for professional content
- Supports articles and links
- Great for B2B marketing

**YouTube:**
- Requires video URL
- Posts as video comment
- Can update video description

**Facebook:**
- No character limit
- Supports images, videos, links
- Best engagement on Pages

---

## 🎯 Monetization Ideas (SaaS Version)

### Pricing Tiers

**Free Plan** - $0/month
- 10 posts per month
- 3 platforms
- Basic analytics

**Basic Plan** - $19/month
- 100 posts per month
- All 5 platforms
- Advanced analytics
- Post scheduling

**Pro Plan** - $49/month
- Unlimited posts
- All features
- Priority support
- White-label option
- API access

**Agency Plan** - $99/month
- Multiple client accounts
- Team collaboration
- Advanced reporting
- Custom branding

### Target Customers

1. **Healthcare Professionals**
   - Doctors, dentists, clinics
   - Patient education content
   - Health tips and updates

2. **Local Businesses**
   - Restaurants, salons, gyms
   - Promotions and updates
   - Customer engagement

3. **Bloggers & Content Creators**
   - Personal brands
   - Multi-platform presence
   - Content repurposing

4. **Small Marketing Agencies**
   - Managing multiple clients
   - Streamlined workflows
   - Reporting features

---

## 🔧 Customization

### Adding New Platforms

1. **Create a new service file** in `backend/src/services/`
2. **Implement the platform API** with methods:
   - `createPost()`
   - `getPostStats()`
3. **Add to routes** in `backend/src/routes/posts.js`
4. **Update frontend** platform selector in `frontend/src/App.js`

### Custom Branding

**Frontend:**
- Update logo and colors in `frontend/src/App.js`
- Modify CSS in `frontend/src/App.css`
- Change app name in `package.json`

**Backend:**
- Update API responses in `backend/src/server.js`
- Add custom headers for branding

---

## 🐛 Troubleshooting

### Common Issues

**1. "Failed to post to [Platform]"**
- Check API credentials in `.env`
- Verify token hasn't expired
- Check platform-specific permissions

**2. "WordPress connection failed"**
- Verify application password is correct
- Check WordPress site is accessible
- Ensure REST API is enabled

**3. "Media upload failed"**
- Check file size (max 10MB)
- Verify file format is supported
- Ensure uploads directory exists

**4. "Instagram post failed"**
- Instagram requires Business account
- Account must be connected to Facebook Page
- Image URL must be publicly accessible

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
```

Check logs in terminal for detailed error messages.

---

## 📈 Future Enhancements

- [ ] Pinterest integration
- [ ] TikTok integration
- [ ] AI-powered caption generation
- [ ] Bulk scheduling
- [ ] Content calendar view
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Zapier integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

MIT License - feel free to use this for personal or commercial projects.

---

## 📧 Support

For support, email: support@visualwits.com

Built with ❤️ by **Visualwits**

---

## 🙏 Credits

- React.js
- Node.js / Express
- Tailwind CSS
- Lucide Icons
- All the amazing social media APIs

---

**Happy Publishing! 🚀**
#   s o c i a l - a u t o - p u b l i s h e r  
 