# 🧪 API Testing Guide

Complete guide to testing the Social Auto Publisher API endpoints.

## Setup for Testing

### Install Required Tools

```bash
# HTTPie (user-friendly alternative to curl)
sudo apt install httpie  # Ubuntu/Debian
brew install httpie       # macOS

# jq (JSON processor)
sudo apt install jq       # Ubuntu/Debian
brew install jq          # macOS
```

---

## Health Check

### Test if API is running

```bash
curl http://localhost:5000/api/health
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

## WordPress Integration

### 1. Test WordPress Connection

```bash
curl -X POST http://localhost:5000/api/wordpress/connect \
  -H "Content-Type: application/json" \
  -d '{
    "siteUrl": "https://yourblog.com",
    "username": "your_username",
    "appPassword": "xxxx xxxx xxxx xxxx"
  }'
```

### 2. Fetch Recent WordPress Posts

```bash
curl "http://localhost:5000/api/wordpress/posts?siteUrl=https://yourblog.com&username=your_username&appPassword=xxxx%20xxxx%20xxxx%20xxxx&limit=5"
```

### 3. Get Specific WordPress Post

```bash
curl "http://localhost:5000/api/wordpress/post/123?siteUrl=https://yourblog.com&username=your_username&appPassword=xxxx%20xxxx%20xxxx%20xxxx"
```

### 4. Generate Caption from WordPress Post

```bash
curl -X POST http://localhost:5000/api/wordpress/generate-caption \
  -H "Content-Type: application/json" \
  -d '{
    "post": {
      "title": "10 Tips for Better Sleep",
      "excerpt": "Discover science-backed methods to improve your sleep quality...",
      "link": "https://yourblog.com/better-sleep",
      "categories": ["Health", "Wellness"]
    },
    "platform": "twitter",
    "maxLength": 280
  }'
```

### 5. Search WordPress Posts

```bash
curl "http://localhost:5000/api/wordpress/search?siteUrl=https://yourblog.com&username=your_username&appPassword=xxxx%20xxxx%20xxxx%20xxxx&keyword=health&limit=10"
```

---

## Multi-Platform Publishing

### 1. Post Text Only (No Media)

```bash
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=Just launched my new blog post! 🚀 Check it out and let me know what you think." \
  -F "blogUrl=https://yourblog.com/my-post" \
  -F 'platforms=["facebook","linkedin","twitter"]'
```

### 2. Post with Image

```bash
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=Excited to share this beautiful moment! 📸" \
  -F "blogUrl=https://yourblog.com/photography" \
  -F "media=@/path/to/image.jpg" \
  -F 'platforms=["facebook","instagram","twitter"]'
```

### 3. Post to All Platforms

```bash
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=New blog post is live! Read about the latest trends in digital marketing." \
  -F "blogUrl=https://yourblog.com/digital-marketing" \
  -F "youtubeUrl=https://youtube.com/watch?v=VIDEO_ID" \
  -F "media=@/path/to/featured-image.jpg" \
  -F 'platforms=["facebook","instagram","linkedin","twitter","youtube"]'
```

### 4. Instagram-Specific Post (Requires Image)

```bash
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=Beautiful sunset at the beach 🌅 #photography #nature #sunset" \
  -F "media=@/path/to/sunset.jpg" \
  -F 'platforms=["instagram"]'
```

### 5. LinkedIn Professional Post

```bash
curl -X POST http://localhost:5000/api/posts/create \
  -F "caption=Thrilled to announce our new partnership! This collaboration will bring innovative solutions to the healthcare industry. Read more about our mission and vision." \
  -F "blogUrl=https://yourblog.com/partnership-announcement" \
  -F "media=@/path/to/announcement.jpg" \
  -F 'platforms=["linkedin"]'
```

---

## Testing Individual Platform Services

### Facebook Post Test

Create a file `test-facebook.js`:

```javascript
const FacebookService = require('./backend/src/services/FacebookService');

async function testFacebook() {
  const fb = new FacebookService(
    'YOUR_PAGE_ACCESS_TOKEN',
    'YOUR_PAGE_ID'
  );

  try {
    // Test text post
    const result = await fb.createPost(
      'Testing Facebook API integration! 🎉',
      null,
      'https://yourblog.com'
    );
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFacebook();
```

Run: `node test-facebook.js`

### Instagram Post Test

Create a file `test-instagram.js`:

```javascript
const InstagramService = require('./backend/src/services/InstagramService');

async function testInstagram() {
  const ig = new InstagramService(
    'YOUR_ACCESS_TOKEN',
    'YOUR_BUSINESS_ACCOUNT_ID'
  );

  try {
    const result = await ig.createPost(
      'Testing Instagram API! 📸 #test #api',
      'https://example.com/image.jpg'
    );
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testInstagram();
```

### LinkedIn Post Test

Create a file `test-linkedin.js`:

```javascript
const LinkedInService = require('./backend/src/services/LinkedInService');

async function testLinkedIn() {
  const li = new LinkedInService(
    'YOUR_ACCESS_TOKEN',
    'urn:li:person:YOUR_PERSON_ID'
  );

  try {
    const result = await li.createTextPost(
      'Excited to share my latest insights on digital transformation!',
      'https://yourblog.com/digital-transformation'
    );
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLinkedIn();
```

### Twitter Post Test

Create a file `test-twitter.js`:

```javascript
const TwitterService = require('./backend/src/services/TwitterService');

async function testTwitter() {
  const tw = new TwitterService(
    'YOUR_API_KEY',
    'YOUR_API_SECRET',
    'YOUR_ACCESS_TOKEN',
    'YOUR_ACCESS_SECRET'
  );

  try {
    const result = await tw.createTweet(
      'Testing Twitter API integration! 🐦 #api #test'
    );
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testTwitter();
```

### YouTube Comment Test

Create a file `test-youtube.js`:

```javascript
const YouTubeService = require('./backend/src/services/YouTubeService');

async function testYouTube() {
  const yt = new YouTubeService(
    'YOUR_API_KEY',
    'YOUR_ACCESS_TOKEN'
  );

  try {
    const result = await yt.commentOnVideo(
      'VIDEO_ID',
      'Great video! Check out my related blog post: https://yourblog.com'
    );
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testYouTube();
```

---

## Error Responses

### Invalid Credentials

```json
{
  "error": "Failed to post to Facebook: Invalid OAuth access token."
}
```

### Missing Required Fields

```json
{
  "error": "Caption is required"
}
```

### Platform Not Selected

```json
{
  "error": "At least one platform must be selected"
}
```

### Instagram Without Image

```json
{
  "results": {
    "success": [],
    "failed": [
      {
        "platform": "instagram",
        "error": "Instagram requires an image"
      }
    ]
  }
}
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Create a new collection "Social Auto Publisher"
4. Add these requests:

#### Health Check
- Method: GET
- URL: `http://localhost:5000/api/health`

#### Create Post
- Method: POST
- URL: `http://localhost:5000/api/posts/create`
- Body: form-data
  - caption: "Your caption here"
  - blogUrl: "https://yourblog.com"
  - platforms: ["facebook","twitter"]
  - media: (file upload)

#### WordPress Posts
- Method: GET
- URL: `http://localhost:5000/api/wordpress/posts`
- Params:
  - siteUrl: "https://yourblog.com"
  - username: "your_username"
  - appPassword: "xxxx xxxx xxxx"
  - limit: 10

---

## Testing Checklist

Before deploying to production, test:

- [ ] WordPress connection works
- [ ] Can fetch WordPress posts
- [ ] Caption generation works correctly
- [ ] Each platform posts successfully:
  - [ ] Facebook
  - [ ] Instagram
  - [ ] LinkedIn
  - [ ] Twitter
  - [ ] YouTube
- [ ] Image uploads work
- [ ] Video uploads work (if supported)
- [ ] Error handling works correctly
- [ ] API returns proper status codes
- [ ] CORS is configured correctly

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test 100 requests with 10 concurrent connections
ab -n 100 -c 10 http://localhost:5000/api/health

# POST request test
ab -n 50 -c 5 -p post-data.json -T application/json http://localhost:5000/api/posts/create
```

### Load Testing with Artillery

Install:
```bash
npm install -g artillery
```

Create `load-test.yml`:
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Sustained load"
scenarios:
  - name: "Health check"
    flow:
      - get:
          url: "/api/health"
```

Run:
```bash
artillery run load-test.yml
```

---

## Debugging Tips

### Enable Verbose Logging

In `backend/.env`:
```env
NODE_ENV=development
DEBUG=*
```

### Check Platform API Responses

Add logging in services:
```javascript
console.log('API Request:', requestData);
console.log('API Response:', response.data);
```

### Test Platform APIs Directly

Use their official API explorers:
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [LinkedIn API Console](https://www.linkedin.com/developers/tools/console)
- [Twitter API Tester](https://developer.twitter.com/en/docs/twitter-api/tools-and-libraries/postman)

---

## Success Metrics

Track these metrics for each platform:
- Post success rate
- Average response time
- Error types and frequency
- API rate limit usage
- User engagement (likes, comments, shares)

---

**Happy Testing! 🧪**
