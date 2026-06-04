const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

const GEMINI_API_KEY = 'AIzaSyCiH0F712lgYpZDL__IePbaD45n5DBqcYg';
const GEMINI_MODEL = 'gemini-1.5-flash';

// Serve static assets from project root
const PUBLIC_DIR = path.resolve(__dirname);
app.use(express.static(PUBLIC_DIR, { index: false }));

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
- ជួយអប់រំដោយភាពរីករាយ
- វេបសាយ: https://rotana-elearningg.web.app`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const parts = [{ text: `${systemPrompt}\n\nសំណួរ: ${prompt}` }];
    if (base64Image) {
      parts.push({ 
        inlineData: { 
          mimeType: "image/png", 
          data: base64Image 
        } 
      });
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'សុំទោស ប្រព័ន្ធមានបញ្ហាបន្តិច!';
    
    res.json({ reply });
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
    const reqPath = decodeURIComponent(req.path);
    // If request is for root
    if (reqPath === '/' || reqPath === '') {
      const indexFile = path.join(PUBLIC_DIR, 'index.html');
      return res.sendFile(indexFile);
    }

    // If path already ends with .html or has an extension, try to serve directly
    if (reqPath.endsWith('.html') || /\.[a-z0-9]+$/i.test(reqPath)) {
      const file = path.join(PUBLIC_DIR, reqPath);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return res.sendFile(file);
      return next();
    }

    // Try serving {path}.html
    const candidate = path.join(PUBLIC_DIR, reqPath + '.html');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return res.sendFile(candidate);

    // Fallback to index.html for SPA routes
    const indexFile = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(indexFile)) return res.sendFile(indexFile);

    return next();
  } catch (e) {
    return next(e);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
