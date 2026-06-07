# 🚀 Rotana E-Learning - Development Setup Guide

## ⚡ Quick Start (Windows)

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
dev-setup.bat

# Or using npm
npm run dev:all
```

### Option 2: Manual Setup (Two Terminals)

**Terminal 1 - Backend Server:**
```bash
npm install              # First time only
npm run dev             # Runs on http://localhost:3001
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm install             # First time only
npm run dev            # Runs on http://localhost:5173
```

---

## 📋 Prerequisites

✅ Node.js >= 14.0.0  
✅ npm or yarn  
✅ `.env` file in root with `GEMINI_API_KEY`  
✅ `.env` file in `frontend/` with Firebase keys  

---

## 🔍 Verify Setup

### Check Backend is Running
```bash
curl http://localhost:3001/__health
# Should return: { "ok": true, "time": "..." }
```

### Check Frontend is Running
- Open http://localhost:5173 in browser
- Should load Rotana E-Learning website

### Test Chatbot API
```bash
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"prompt": "សូមបង្រៀនខ្ញុំ"}'

# Should return: { "reply": "..." }
```

---

## 🐛 Troubleshooting

### Error: "http proxy error: /api/chatbot"

**Cause:** Backend server not running

**Fix:**
```bash
# Terminal 1
npm run dev

# Terminal 2 (after backend starts)
cd frontend
npm run dev
```

---

### Error: "Cannot find module 'dotenv'"

**Cause:** Dependencies not installed

**Fix:**
```bash
npm install
npm install dotenv
```

---

### Error: "Port 3001 already in use"

**Fix on Windows:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Fix on Mac/Linux:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

---

### Error: "GEMINI_API_KEY not found"

**Fix:** Check `.env` file in root directory

**File:** `/.env`
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
NODE_ENV=development
```

Then restart: `npm run dev`

---

### Error: "Chatbot returns fallback response"

**Check:**
1. Backend is running: `curl http://localhost:3001/__health`
2. API key is valid in `.env`
3. Internet connection is working
4. Check server logs for errors

---

## 📁 Project Structure

```
Rotana-Elearning(New)/
├── .env                          # Root env (BACKEND)
├── server.js                     # Backend server
├── package.json                  # Root dependencies
├── dev-setup.bat                 # Windows setup script
├── dev-setup.sh                  # Unix/Mac setup script
│
└── frontend/
    ├── .env                      # Frontend env (VITE)
    ├── vite.config.ts            # Vite proxy config
    ├── package.json              # Frontend dependencies
    ├── src/
    │   ├── services/
    │   │   ├── geminiService.ts   # ✨ Gemini AI service
    │   │   └── chatbotApi.ts      # Chatbot API
    │   ├── pages/
    │   │   └── ChatbotPage.tsx    # Chatbot component
    │   └── types/
    │       └── gemini.ts          # TypeScript types
```

---

## 📊 Server Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + Vite)                               │
│  Running: http://localhost:5173                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ChatbotPage.tsx                                 │  │
│  │ → sendChatMessage('question')                   │  │
│  │ → API call: POST /api/chatbot                   │  │
│  └──────────────────────┬──────────────────────────┘  │
└─────────────────────────┼────────────────────────────────┘
                          │
              Vite Proxy (vite.config.ts)
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Express)                                      │
│  Running: http://localhost:3001                        │
│                                                         │
│  POST /api/chatbot                                      │
│  ↓                                                      │
│  Load API Key from .env (GEMINI_API_KEY)               │
│  ↓                                                      │
│  Call Gemini API (generativelanguage.googleapis.com)   │
│  ↓                                                      │
│  Return Response: { "reply": "..." }                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Environment Variables

### Root `.env` (Backend)
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

---

## 💻 Common Commands

```bash
# Start backend only
npm run dev

# Start frontend only
cd frontend && npm run dev

# Start both (if concurrently installed)
npm run dev:all

# Install all dependencies
npm install && cd frontend && npm install && cd ..

# Test backend health
npm run test:api

# Build frontend for production
cd frontend && npm run build
```

---

## ✅ Verification Checklist

Before testing the chatbot, verify:

- [ ] Backend running: `http://localhost:3001/__health` → returns `{ "ok": true }`
- [ ] Frontend running: `http://localhost:5173` → loads website
- [ ] Vite proxy working: No "http proxy error" in console
- [ ] API key set: `.env` file has `GEMINI_API_KEY`
- [ ] Network: Internet connection working
- [ ] No port conflicts: Ports 3001 and 5173 are free

---

## 🎯 Testing Chatbot

### In Browser Console
```javascript
// Test if backend is reachable
fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'សូមបង្រៀនខ្ញុំ' })
})
.then(r => r.json())
.then(data => console.log('✅ Response:', data))
.catch(err => console.error('❌ Error:', err));
```

### Using Component
```tsx
import { sendChatMessage } from '@/services/geminiService';

// In your component
const response = await sendChatMessage('សូមបង្រៀនខ្ញុំពីJavaScript');
console.log(response);
```

---

## 📞 Support

If you encounter issues:

1. **Check logs:**
   - Backend: `npm run dev` output
   - Frontend: Browser console (F12)

2. **Common issues:**
   - Review "Troubleshooting" section above
   - Check all `.env` variables are set
   - Ensure both servers are running

3. **Documentation:**
   - [GEMINI_SETUP.md](./frontend/src/GEMINI_SETUP.md) - Full Gemini setup
   - [GEMINI_QUICK_START.txt](./frontend/src/GEMINI_QUICK_START.txt) - Quick reference

---

**Last Updated:** 2026-01-15  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
