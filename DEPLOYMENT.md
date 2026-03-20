# 🚀 Deployment Guide

## Production Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 2: Deploy Application

```bash
# Clone repository
git clone <your-repo-url> /var/www/social-auto-publisher
cd /var/www/social-auto-publisher

# Install backend dependencies
cd backend
npm install --production
cp .env.example .env
# Edit .env with production credentials
nano .env

# Install frontend dependencies and build
cd ../frontend
npm install
npm run build

# Copy build to nginx directory
sudo cp -r build/* /var/www/html/
```

#### Step 3: Configure PM2

```bash
cd /var/www/social-auto-publisher/backend

# Start application with PM2
pm2 start src/server.js --name "social-auto-publisher"

# Enable PM2 on system startup
pm2 startup
pm2 save
```

#### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/social-auto-publisher
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # File uploads
    client_max_body_size 10M;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/social-auto-publisher /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Setup SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option 2: Docker Deployment

#### Create Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

#### Create Dockerfile (Frontend)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

#### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Netlify (Frontend) + Heroku (Backend)

#### Deploy Backend to Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FACEBOOK_PAGE_ACCESS_TOKEN=xxx
# ... set all other env vars

# Deploy
git subtree push --prefix backend heroku main

# Or use Heroku Git
cd backend
git init
heroku git:remote -a your-app-name
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### Deploy Frontend to Netlify

1. **Via Netlify CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

2. **Via Netlify Dashboard:**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `build`
- Set environment variable: `REACT_APP_API_URL=https://your-backend.herokuapp.com/api`

---

### Option 4: Vercel (Full Stack)

#### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

#### Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

### Option 5: Railway

1. **Connect GitHub repository**
2. **Railway will auto-detect Node.js**
3. **Add environment variables** in Railway dashboard
4. **Deploy automatically on git push**

---

## Environment Variables for Production

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://your-production-db-url

# JWT
JWT_SECRET=your-super-secure-random-string

# Social Media APIs
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_PAGE_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx

LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
LINKEDIN_ACCESS_TOKEN=xxx
LINKEDIN_PERSON_ID=xxx

TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx

YOUTUBE_API_KEY=xxx
YOUTUBE_CLIENT_ID=xxx
YOUTUBE_CLIENT_SECRET=xxx
YOUTUBE_ACCESS_TOKEN=xxx
YOUTUBE_REFRESH_TOKEN=xxx

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## Security Checklist

- [ ] All API keys stored in environment variables
- [ ] SSL certificate installed and configured
- [ ] Rate limiting enabled on API endpoints
- [ ] CORS configured for production domains only
- [ ] Database has strong password
- [ ] Server firewall configured (UFW/iptables)
- [ ] Regular backups scheduled
- [ ] PM2 monitoring enabled
- [ ] Error logging configured (Sentry, LogRocket)
- [ ] API endpoints have authentication

---

## Monitoring & Maintenance

### Setup Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Monitor application
pm2 monit
```

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out /backups/mongo_$DATE
# Upload to S3 or backup service
```

### Update Application

```bash
# Pull latest changes
cd /var/www/social-auto-publisher
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart social-auto-publisher

# Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r build/* /var/www/html/
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx/HAProxy)
- Deploy multiple backend instances
- Use Redis for session management
- Implement job queue (Bull/Bee-Queue)

### Database Optimization
- Add indexes on frequently queried fields
- Use MongoDB Atlas for managed hosting
- Implement connection pooling

### CDN for Static Assets
- CloudFlare
- AWS CloudFront
- Netlify CDN

---

## Cost Estimation

### Small Scale (100 users)
- VPS: $5-10/month (DigitalOcean Droplet)
- Domain: $12/year
- SSL: Free (Let's Encrypt)
- **Total: ~$10/month**

### Medium Scale (1000 users)
- VPS: $20-40/month
- MongoDB Atlas: $25/month
- CDN: $5-10/month
- **Total: ~$60/month**

### Large Scale (10,000+ users)
- Multiple servers: $100-200/month
- Database cluster: $100/month
- Load balancer: $20/month
- CDN: $50/month
- **Total: ~$300/month**

---

## Support & Troubleshooting

### Check Logs

```bash
# PM2 logs
pm2 logs social-auto-publisher

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
journalctl -u nginx -f
```

### Common Production Issues

1. **502 Bad Gateway**
   - Check if backend is running: `pm2 status`
   - Verify backend port in nginx config
   - Check firewall rules

2. **CORS Errors**
   - Update FRONTEND_URL in backend .env
   - Check CORS middleware in server.js

3. **API Rate Limits**
   - Implement caching
   - Use Redis for rate limiting
   - Queue API calls

---

**Deployment Complete! 🎉**

Your Social Auto Publisher is now live and ready for users!
