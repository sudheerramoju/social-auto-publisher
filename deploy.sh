#!/bin/bash

# Quick Netlify + Heroku Deployment Script
# Run this after setting up Heroku and Netlify accounts

echo "🚀 Social Auto Publisher - Quick Deploy Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI not found${NC}"
    echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Deploy Backend to Heroku
echo "📦 Deploying Backend to Heroku..."
echo ""

read -p "Enter your Heroku app name (e.g., my-social-api): " HEROKU_APP

cd backend

# Check if Heroku app exists
if heroku apps:info --app $HEROKU_APP &> /dev/null; then
    echo -e "${GREEN}✅ Found existing Heroku app: $HEROKU_APP${NC}"
else
    echo "Creating new Heroku app: $HEROKU_APP"
    heroku create $HEROKU_APP
fi

# Set essential config
echo "Setting environment variables..."
heroku config:set NODE_ENV=production --app $HEROKU_APP
heroku config:set PORT=5000 --app $HEROKU_APP

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Set your API credentials in Heroku dashboard${NC}"
echo "Visit: https://dashboard.heroku.com/apps/$HEROKU_APP/settings"
echo ""

# Initialize git and deploy
if [ ! -d .git ]; then
    git init
fi

heroku git:remote -a $HEROKU_APP

git add .
git commit -m "Deploy backend to Heroku" || echo "No changes to commit"
git push heroku HEAD:main --force

BACKEND_URL="https://$HEROKU_APP.herokuapp.com"

echo ""
echo -e "${GREEN}✅ Backend deployed to: $BACKEND_URL${NC}"
echo ""

# Test backend
echo "Testing backend..."
sleep 5
curl -s $BACKEND_URL/api/health && echo "" || echo -e "${RED}❌ Backend not responding${NC}"

echo ""
echo "=============================================="
echo ""

# Deploy Frontend to Netlify
cd ../frontend

echo "📦 Deploying Frontend to Netlify..."
echo ""

# Create production env file
echo "REACT_APP_API_URL=$BACKEND_URL/api" > .env.production

# Build
echo "Building frontend..."
npm install
npm run build

# Deploy to Netlify
netlify deploy --prod

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Set your API credentials in Heroku:"
echo "   ${YELLOW}https://dashboard.heroku.com/apps/$HEROKU_APP/settings${NC}"
echo ""
echo "2️⃣  Update CORS in backend with your Netlify URL"
echo ""
echo "3️⃣  Test your application!"
echo ""
echo "🔗 Your URLs:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: (Check Netlify CLI output above)"
echo ""
