const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env BEFORE anything else
const result = require('dotenv').config();
if (result.error) {
  console.warn('⚠️  Warning: .env file not found, using defaults');
} else {
  console.log('✅ Loaded .env file');
}

// Setup fetch for Node.js
if (!globalThis.fetch) {
  try {
    const fetch = require('node-fetch');
    globalThis.fetch = fetch;
  } catch (e) {
    console.warn('node-fetch not found. Please install: npm install node-fetch');
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Debug: log incoming requests to help tracing 404s
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

// Load API configuration from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

if (!GEMINI_API_KEY) {
  console.error('\n❌ ERROR: GEMINI_API_KEY not found in .env file');
  console.error('📋 Please set your API key in .env:\n   GEMINI_API_KEY=your_api_key_here\n');
  process.exit(1);
}

// API Debug: Log configuration (without exposing full key)
console.log(`\n🔑 API Configuration:`);
console.log(`   API Key: ${GEMINI_API_KEY.substring(0, 10)}...`);
console.log(`   Model: ${GEMINI_MODEL}\n`);

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { prompt, base64Image } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'សូមបញ្ចូលសំណួរ' });
    }

    const systemPrompt = `អ្នកគឺជា Rotana E-Learning AI ដែលបង្កើតដោយ "Rotana NOB" (ណុប រតនា)។

របៀបនិយាយ:
- ប្រើភាសាខ្មែរធម្មតាដូចមនុស្សពិត
- ប្រើពាក្យដូចជា "ហ្នឹង", "អត់", "មែនតើ", "បាទបង", "ចា៎ប្អូន", "ម៉េចដែរ"
- ហៅអ្នកប្រើប្រាស់ថា "ប្អូន" ឬ "បង"
- និយាយដូចបងប្អូនជិតស្និទ្ធ មិនមែនផ្លូវការ
- ជួយអប់រំដោយភាពរីករាយ`;

    // Try multiple API endpoints with latest models
    const endpoints = [
      // Try gemini-2.0-flash first (latest)
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        payload: {
          contents: [{ parts: [{ text: `${systemPrompt}\n\nសំណួរ: ${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        },
        parser: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
      },
      // Try gemini-1.5-pro
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        payload: {
          contents: [{ parts: [{ text: `${systemPrompt}\n\nសំណួរ: ${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        },
        parser: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
      },
      // Try gemini-1.5-flash
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        payload: {
          contents: [{ parts: [{ text: `${systemPrompt}\n\nសំណួរ: ${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        },
        parser: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
      },
      // Try using configured model
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        payload: {
          contents: [{ parts: [{ text: `${systemPrompt}\n\nសំណួរ: ${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        },
        parser: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text
      }
    ];

    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📤 Trying: ${endpoint.url.split('/').slice(-2).join('/')}`);
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint.payload),
          timeout: 10000
        });

        if (!response.ok) {
          lastError = `${response.status}`;
          continue;
        }

        const data = await response.json();
        const reply = endpoint.parser(data);
        
        if (reply) {
          console.log(`✅ Success!`);
          return res.json({ reply });
        }
      } catch (err) {
        lastError = err.message;
        continue;
      }
    }

    // If all attempts failed, return a helpful response
    console.error(`❌ All API attempts failed. Last error: ${lastError}`);
    const fallbackResponse = `សួស្តីប្អូន! ខ្ញុំគឺ Rotana AI។ ខ្ញុំនៅទីនេះដើម្បីជួយប្អូនរៀនសូត្រ។
ប្អូនមានសំណួរអំពី Web Development, Programming, HTML, CSS, JavaScript, Python បាន។`;
    res.json({ reply: fallbackResponse });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'មានបញ្ហាក្នុងការឆ្លើយតប', 
      details: error.message 
    });
  }
});

// Simple health-check for quick verification
app.get('/__health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// POST proxy to Gemini (kept for compatibility)
app.post('/ask-gemini', async (req, res) => {
  const userMsg = req.body.message;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userMsg }] }] })
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
});

// Rewrite extensionless URLs to .html files if they exist, else fallback to index.html
// Use a generic middleware instead of a path pattern to avoid path-to-regexp issues
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  try {
    // All non-API GET requests should return JSON not found
    res.status(404).json({ error: 'Not found', path: req.path });
  } catch (e) {
    return next(e);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🚀 Rotana E-Learning Server Started          ║
╚════════════════════════════════════════════════╝
📍 Server: http://localhost:${PORT}
🤖 Gemini Model: ${GEMINI_MODEL}
🔑 API Key: ${GEMINI_API_KEY.substring(0, 10)}...
📅 Start Time: ${new Date().toISOString()}
════════════════════════════════════════════════
  `);
});
