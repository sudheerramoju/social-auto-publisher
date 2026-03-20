#!/bin/bash

# Railway FREE Deployment Script
# Social Auto Publisher Backend

echo "🚀 Railway FREE Deployment"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Railway CLI${NC}"
        echo "Try manually: npm install -g @railway/cli"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Login to Railway
echo "Logging in to Railway..."
echo "This will open your browser for authentication."
echo ""
railway login

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to login to Railway${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Logged in successfully${NC}"
echo ""

# Navigate to backend
cd backend || exit 1

# Initialize Railway project
echo "Initializing Railway project..."
railway init

echo ""
echo -e "${GREEN}✅ Project initialized${NC}"
echo ""

# Set basic environment variables
echo "Setting basic environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Add your API credentials${NC}"
echo ""
echo "Run these commands to add your API keys:"
echo ""
echo "railway variables set FACEBOOK_PAGE_ACCESS_TOKEN=your_token"
echo "railway variables set INSTAGRAM_BUSINESS_ACCOUNT_ID=your_id"
echo "railway variables set LINKEDIN_ACCESS_TOKEN=your_token"
echo "railway variables set LINKEDIN_PERSON_ID=urn:li:person:your_id"
echo "railway variables set TWITTER_API_KEY=your_key"
echo "railway variables set TWITTER_API_SECRET=your_secret"
echo "railway variables set TWITTER_ACCESS_TOKEN=your_token"
echo "railway variables set TWITTER_ACCESS_SECRET=your_secret"
echo "railway variables set YOUTUBE_API_KEY=your_key"
echo "railway variables set YOUTUBE_ACCESS_TOKEN=your_token"
echo ""
echo "OR add them via Railway dashboard:"
echo "https://railway.app/dashboard"
echo ""

read -p "Press Enter after adding your environment variables..."

# Deploy
echo ""
echo "Deploying to Railway..."
railway up

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed${NC}"
    exit 1
fi

echo ""
echo "Getting your backend URL..."
railway domain

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Backend Deployed to Railway (FREE)!${NC}"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Get your backend URL:"
echo "   ${YELLOW}railway domain${NC}"
echo ""
echo "2️⃣  Update frontend REACT_APP_API_URL"
echo "   ${YELLOW}REACT_APP_API_URL=https://your-app.railway.app/api${NC}"
echo ""
echo "3️⃣  Deploy frontend to Netlify"
echo ""
echo "4️⃣  Update CORS in backend with Netlify URL:"
echo "   ${YELLOW}railway variables set FRONTEND_URL=https://your-app.netlify.app${NC}"
echo ""
echo "🎉 Your backend is now LIVE and FREE!"
echo ""
