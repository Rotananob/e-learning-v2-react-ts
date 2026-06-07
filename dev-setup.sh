#!/bin/bash
# 🚀 Rotana E-Learning Development Setup
# This script starts both the backend server and frontend dev server

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Rotana E-Learning - Development Mode                  ║"
echo "║     Backend: http://localhost:3001                        ║"
echo "║     Frontend: http://localhost:5173                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if node_modules exist in root
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

# Check if node_modules exist in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start backend and frontend servers
echo ""
echo "🔧 Starting servers..."
echo "   - Backend on port 3001"
echo "   - Frontend on port 5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Check if concurrently is installed, if not use separate terminals
if command -v concurrently &> /dev/null; then
    npm run dev:all
else
    echo "💡 Tip: Install 'concurrently' for running both servers at once"
    echo "   npm install -g concurrently"
    echo ""
    echo "For now, running backend only. Start frontend in another terminal:"
    echo "   cd frontend && npm run dev"
    echo ""
    npm run dev
fi
