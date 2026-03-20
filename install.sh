#!/bin/bash

# Social Auto Publisher - Quick Start Installation Script
# By Visualwits

echo "🚀 Social Auto Publisher - Installation Script"
echo "==============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Setup backend environment
if [ ! -f .env ]; then
    echo "⚙️  Setting up backend environment..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your API credentials${NC}"
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

# Create uploads directory
mkdir -p ../backend/uploads
echo -e "${GREEN}✅ Created uploads directory${NC}"
echo ""

# Installation complete
echo "============================================="
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo "============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Configure your API credentials:"
echo "   ${YELLOW}nano backend/.env${NC}"
echo ""
echo "2️⃣  Start the backend server:"
echo "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "3️⃣  In a new terminal, start the frontend:"
echo "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "4️⃣  Open your browser:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: README.md"
echo "   - Deployment: DEPLOYMENT.md"
echo ""
echo "💡 Need help? Check the README.md for detailed setup instructions"
echo ""
echo "Happy Publishing! 🚀"
