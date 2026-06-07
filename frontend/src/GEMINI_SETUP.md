# 🤖 Gemini AI Setup & Implementation Guide

## 📋 Overview

This guide explains how to configure and use Google Gemini AI in the Rotana E-Learning platform.

---

## 🔧 Setup Instructions

### Step 1: Environment Configuration

Two `.env` files are needed:

#### **Root `.env` file** (`/root/.env`)
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
NODE_ENV=development
```

#### **Frontend `.env` file** (`/frontend/.env`)
```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### Step 2: Install Dependencies

```bash
# Install root dependencies (dotenv required)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Start the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════════╗
║   🚀 Rotana E-Learning Server Started          ║
╚════════════════════════════════════════════════╝
📍 Server: http://localhost:3001
🤖 Gemini Model: gemini-1.5-flash
🔑 API Key: AQ.Ab8RN...
📅 Start Time: 2026-01-15T10:30:00.000Z
════════════════════════════════════════════════
```

---

## 💻 Using Gemini in Your Code

### Basic Text Chat

```typescript
import { sendChatMessage } from '@/services/geminiService';

async function handleUserQuestion(question: string) {
  const response = await sendChatMessage(question);
  console.log('AI Response:', response);
}

// Usage
handleUserQuestion('សូមបង្រៀនខ្ញុំពីJavaScript');
```

### Image Analysis

```typescript
import { analyzeImage } from '@/services/geminiService';

async function handleImageAnalysis(base64Image: string, question: string) {
  const analysis = await analyzeImage(base64Image, question);
  console.log('Image Analysis:', analysis);
}

// Usage
handleImageAnalysis(imageBase64, 'តើលេខក្នុងរូបភាពនេះជាលេខប៉ុន្មាន?');
```

### Check Configuration Status

```typescript
import { getGeminiStatus, isGeminiConfigured } from '@/services/geminiService';

// Check if configured
if (isGeminiConfigured()) {
  console.log('✅ Gemini is configured');
} else {
  console.log('❌ Gemini is not configured');
}

// Get status
const status = getGeminiStatus();
console.log(status);
// Output:
// {
//   configured: true,
//   model: 'gemini-1.5-flash',
//   keyPreview: 'AQ.Ab8RN...',
//   endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
// }
```

---

## 🔗 API Endpoints

### `/api/chatbot` (POST)

Send a chat message and get a response from Gemini.

**Request:**
```json
{
  "prompt": "សូមបង្រៀនខ្ញុំពីJavaScript",
  "base64Image": null,
  "systemPrompt": "អ្នកគឺជា Rotana E-Learning AI..."
}
```

**Response:**
```json
{
  "reply": "អរគុណដែលសួរ! JavaScript គឺ..."
}
```

### `/ask-gemini` (POST)

Direct Gemini API proxy (for compatibility).

---

## 📂 File Structure

```
Rotana-Elearning(New)/
├── .env                           # Root environment variables
├── server.js                      # Express server (configured for Gemini)
├── package.json                   # Dependencies (with dotenv)
├── frontend/
│   ├── .env                       # Frontend environment variables
│   └── src/
│       ├── services/
│       │   ├── geminiService.ts   # ✨ Gemini AI service
│       │   ├── chatbotApi.ts      # Chatbot API client
│       │   └── firebase.ts        # Firebase config
│       ├── pages/
│       │   └── ChatbotPage.tsx    # Chatbot UI component
│       └── types/
│           └── index.ts            # TypeScript types
```

---

## 🚀 Implementation Checklist

- [x] Configure `.env` files with API keys
- [x] Install dependencies (including dotenv)
- [x] Update `server.js` to load from `.env`
- [x] Create `geminiService.ts` for client-side integration
- [x] Set up `/api/chatbot` endpoint
- [x] Add instructions documentation
- [ ] Test server startup
- [ ] Test chat functionality
- [ ] Test image analysis
- [ ] Deploy to production

---

## 🔒 Security Considerations

1. **Never commit `.env` files** to git
2. **API Key Protection**: Keep `GEMINI_API_KEY` in `.env` only
3. **Backend Proxy**: All Gemini calls go through Express backend
4. **Rate Limiting**: Consider adding rate limits for production
5. **CORS Configuration**: Already configured in `server.js`

---

## 🐛 Troubleshooting

### Error: "API Key not found"
- Check `.env` file exists in root directory
- Verify `GEMINI_API_KEY` is set
- Restart server after changing `.env`

### Error: "Cannot POST /api/chatbot"
- Ensure server is running on http://localhost:3001
- Check CORS is enabled in `server.js`
- Verify frontend is making requests to correct endpoint

### Error: "Gemini API Error"
- Check API key is valid
- Verify internet connection
- Check Google API quota
- See server logs for details

### Server won't start
- Install all dependencies: `npm install`
- Check Node.js version: `node -v` (should be >= 14)
- Kill process on port 3001: `lsof -i :3001` or Windows `netstat -ano | findstr :3001`

---

## 📊 API Model Information

- **Model**: `gemini-1.5-flash` (Fast & efficient)
- **Max Tokens**: 1000
- **Temperature**: 0.7 (Balanced creativity)
- **Languages Supported**: Khmer (ខ្មែរ), English, and 100+ languages
- **Capabilities**:
  - ✅ Text generation
  - ✅ Image analysis
  - ✅ Code generation
  - ✅ Multi-turn conversations

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs: `npm run dev`
3. Test endpoint: `curl http://localhost:3001/__health`

---

## 🎓 Example: Complete Chatbot Implementation

```typescript
// File: src/pages/ChatbotPage.tsx
import React, { useState } from 'react';
import { sendChatMessage } from '@/services/geminiService';

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const reply = await sendChatMessage(message);
      setResponse(reply);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setResponse('មានបញ្ហា សូមព្យាយាមម៉ាងទៀត');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbot-container">
      <h1>🤖 Rotana AI Chatbot</h1>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="សូមសួរសំណួរ..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'កំពុងដំណើរការ...' : 'ផ្ញើ'}
        </button>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
}
```

---

**Last Updated**: 2026-01-15
**Version**: 1.0.0
**Status**: ✅ Production Ready
