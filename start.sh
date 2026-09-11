#!/usr/bin/env bash

# Move to script directory
cd "$(dirname "$0")"

echo "================================================"
echo "   🚀 Memorize Supporter - Quick Launcher"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v20 or higher) first."
    exit 1
fi

# Run nvm if available
if command -v nvm &> /dev/null; then
    nvm use 20 2> /dev/null || true
fi

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing project dependencies..."
    npm install
fi

# Run setup if .env is missing
if [ ! -f ".env" ]; then
    echo "⚙️ Running one-time setup..."
    npm run setup
fi

# Start dev server
echo ""
echo "✨ Starting Memorize Supporter..."
npm run dev
