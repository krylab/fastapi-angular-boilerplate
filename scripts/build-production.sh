#!/bin/bash

# Build script for production deployment
# This script builds the Angular frontend and prepares for Docker build

set -e

echo "🚀 Building production deployment..."

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js and npm are required but not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Step 1: Build Angular frontend
echo "📦 Building Angular frontend..."
cd web-angular

if [ ! -d "node_modules" ]; then
    echo "📥 Installing Angular dependencies..."
    npm install
fi

echo "🔨 Building Angular for production..."
npm run build:prod

cd ..

# Step 2: Verify build output
if [ ! -f "publish/browser/index.html" ]; then
    echo "❌ Error: Angular build failed - publish/browser/index.html not found"
    exit 1
fi

echo "✅ Angular build completed successfully"
echo "📁 Build output: $(du -sh publish | cut -f1) in publish/"

# Step 3: Build Docker image
echo "🐳 Building Docker image..."
docker compose build api

echo "🎉 Production build completed successfully!"
echo ""
echo "To start the application:"
echo "  docker compose up"
echo ""
echo "The application will be available at:"
echo "  - Frontend: http://localhost:8000 (now exposed by default)"
echo "  - API docs: http://localhost:8000/api/docs"
