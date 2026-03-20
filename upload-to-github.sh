#!/bin/bash

# Quick GitHub Upload Script
# Social Auto Publisher

echo "🚀 GitHub Upload Script for Social Auto Publisher"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
bash upload-to-github.sh
# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    echo "Install from: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Check if already a git repository
if [ -d .git ]; then
    echo -e "${YELLOW}⚠️  This is already a Git repository${NC}"
    read -p "Do you want to continue? (y/n): " continue
    if [ "$continue" != "y" ]; then
        exit 0
    fi
fi

# Get GitHub username and repo name
echo "sudheer"
read sudheerramoju

echo ""
echo "social-auto-publisher"
read REPO_NAME
REPO_NAME=${REPO_NAME:-social-auto-publisher}

echo ""
echo -e "${YELLOW}📝 Creating .gitignore file...${NC}"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
npm-debug.log*

# Environment variables - NEVER COMMIT THESE!
.env
.env.local
.env.production
*.env

# Production builds
frontend/build/
backend/dist/

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
*.log

# Testing
coverage/
EOF

echo -e "${GREEN}✅ .gitignore created${NC}"
echo ""

# Create README badges
echo -e "${YELLOW}📝 Creating README.md...${NC}"

cat > README.md << EOF
# 🚀 Social Auto Publisher

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://your-demo-url-here)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Multi-platform social media management tool - Post to Facebook, Instagram, LinkedIn, Twitter & YouTube simultaneously

## ✨ Features

- 🚀 One-Click Multi-Platform Posting
- 📝 WordPress Integration
- 📅 Post Scheduling
- 📊 Analytics Dashboard
- 🖼️ Media Support
- 📱 Responsive Design

## 🎯 Supported Platforms

✅ Facebook | ✅ Instagram | ✅ LinkedIn | ✅ Twitter | ✅ YouTube

## 🛠️ Tech Stack

**Frontend:** React 18, Tailwind CSS
**Backend:** Node.js, Express
**APIs:** Facebook, Instagram, LinkedIn, Twitter, YouTube, WordPress

## 🚀 Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
cd $REPO_NAME

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your API credentials

# Start servers
cd backend && npm run dev    # Terminal 1
cd frontend && npm start     # Terminal 2
\`\`\`

## 📖 Documentation

- [Complete Setup Guide](README.md)
- [API Setup](README.md#api-credentials-setup)
- [Deployment Guide](DEPLOYMENT.md)
- [Free Hosting](FREE-BACKEND-HOSTING.md)

## 🚢 Deployment

**Frontend:** Netlify, Vercel (Free)
**Backend:** Railway, Render (Free)

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

**$GITHUB_USERNAME** - [GitHub](https://github.com/$GITHUB_USERNAME)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by Visualwits**
EOF

echo -e "${GREEN}✅ README.md created${NC}"
echo ""

# Initialize git
if [ ! -d .git ]; then
    echo -e "${YELLOW}📦 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

echo ""

# Configure git (check if already configured)
if ! git config user.name &> /dev/null; then
    echo "Enter your Git name (for commits):"
    read GIT_NAME
    git config user.name "$GIT_NAME"
    
    echo "Enter your Git email:"
    read GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

echo ""
echo -e "${YELLOW}📦 Adding files to Git...${NC}"

# Add all files
git add .

echo -e "${GREEN}✅ Files added${NC}"
echo ""

# Check if .env is tracked (it shouldn't be!)
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: .env file is being tracked!${NC}"
    echo "Removing it from Git..."
    git rm --cached .env
fi

if git ls-files --error-unmatch backend/.env 2>/dev/null; then
    echo -e "${RED}⚠️  WARNING: backend/.env file is being tracked!${NC}"
    echo "Removing it from Git..."
    git rm --cached backend/.env
fi

echo ""
echo -e "${YELLOW}💬 Creating initial commit...${NC}"

# Create commit
git commit -m "Initial commit: Social Auto Publisher v1.0

- Complete React frontend with dashboard UI
- Node.js/Express backend with 6 API integrations
- Facebook, Instagram, LinkedIn, Twitter, YouTube, WordPress support
- Multi-platform posting functionality
- Media upload support
- Comprehensive documentation
- Ready for deployment"

echo -e "${GREEN}✅ Initial commit created${NC}"
echo ""

# Rename branch to main
git branch -M main

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Local repository ready!${NC}"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Create a repository on GitHub:"
echo "   Go to: https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo "   Visibility: Public (recommended)"
echo "   DO NOT initialize with README"
echo ""
echo "2️⃣  Connect this repository to GitHub:"
echo "   ${YELLOW}git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git${NC}"
echo ""
echo "3️⃣  Push to GitHub:"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""
echo "🔗 Your repository URL will be:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "Need help? See GITHUB-UPLOAD-GUIDE.md"
echo ""
