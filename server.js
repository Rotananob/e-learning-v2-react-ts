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
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

if (!DEEPSEEK_API_KEY) {
  console.error('\n❌ ERROR: DEEPSEEK_API_KEY not found in .env file');
  console.error('📋 Please set your API key in .env:\n   DEEPSEEK_API_KEY=your_api_key_here\n');
  process.exit(1);
}

// API Debug: Log configuration (without exposing full key)
console.log(`\n🔑 API Configuration:`);
console.log(`   API Key: ${DEEPSEEK_API_KEY.substring(0, 10)}...`);
console.log(`   Model: ${DEEPSEEK_MODEL}\n`);

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

    // Call DeepSeek API (OpenAI-compatible)
    const endpoints = [
      {
        url: 'https://api.deepseek.com/chat/completions',
        payload: {
          model: DEEPSEEK_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        parser: (data) => data.choices?.[0]?.message?.content
      }
    ];

    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📤 Calling DeepSeek API: ${DEEPSEEK_MODEL}`);
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify(endpoint.payload),
          timeout: 15000
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `${response.status}: ${errorText}`;
          console.log(`⚠️  API Error: ${lastError}`);
          continue;
        }

        const data = await response.json();
        const reply = endpoint.parser(data);
        
        if (reply) {
          console.log(`✅ Success!`);
          return res.json({ reply });
        } else {
          console.log(`⚠️  No reply in response:`, JSON.stringify(data).substring(0, 200));
        }
      } catch (err) {
        lastError = err.message;
        console.log(`❌ Error: ${lastError}`);
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

// POST proxy to DeepSeek (kept for compatibility)
app.post('/ask-deepseek', async (req, res) => {
  const userMsg = req.body.message;
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [{ role: 'user', content: userMsg }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'DeepSeek API error', details: err.message });
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
🤖 AI Model: ${DEEPSEEK_MODEL}
🔑 API Key: ${DEEPSEEK_API_KEY.substring(0, 10)}...
📅 Start Time: ${new Date().toISOString()}
════════════════════════════════════════════════
  `);
});
