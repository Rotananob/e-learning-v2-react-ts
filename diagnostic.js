#!/usr/bin/env node
/**
 * 🔍 Rotana E-Learning - Diagnostic & Test Tool
 * 
 * This script checks if everything is set up correctly for Gemini chatbot
 * 
 * Usage:
 *   node diagnostic.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(type, message) {
  const prefix = {
    '✓': `${colors.green}✓${colors.reset}`,
    '✗': `${colors.red}✗${colors.reset}`,
    '⚠': `${colors.yellow}⚠${colors.reset}`,
    'ℹ': `${colors.blue}ℹ${colors.reset}`,
  }[type] || type;
  console.log(`${prefix} ${message}`);
}

async function checkBackendHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/__health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          JSON.parse(data);
          resolve({ status: 200, ok: true });
        } catch {
          resolve({ status: 200, ok: false });
        }
      });
    });
    req.on('error', () => resolve({ status: 0, ok: false }));
    setTimeout(() => { req.destroy(); resolve({ status: 0, ok: false }); }, 3000);
  });
}

async function testChatbotAPI() {
  return new Promise((resolve) => {
    const data = JSON.stringify({ prompt: 'សូមបង្រៀនខ្ញុំ' });
    const req = http.request('http://localhost:3001/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, ok: !!json.reply });
        } catch {
          resolve({ status: res.statusCode, ok: false });
        }
      });
    });
    req.on('error', () => resolve({ status: 0, ok: false }));
    req.write(data);
    req.end();
    setTimeout(() => { req.destroy(); resolve({ status: 0, ok: false }); }, 5000);
  });
}

function checkEnvFile(filePath, requiredVars) {
  if (!fs.existsSync(filePath)) return { exists: false, vars: {} };
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};
  requiredVars.forEach(v => {
    const match = content.match(new RegExp(`${v}=(.+)`));
    vars[v] = match ? match[1].trim() : null;
  });
  return { exists: true, vars };
}

async function runDiagnostics() {
  console.clear();
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  🔍 Rotana E-Learning - Diagnostic Tool                 ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Check root .env
  console.log(`${colors.blue}📋 Checking Environment Files...${colors.reset}\n`);
  
  const rootEnv = checkEnvFile(path.join(__dirname, '.env'), [
    'GEMINI_API_KEY',
    'GEMINI_MODEL',
    'PORT',
  ]);
  
  if (rootEnv.exists) {
    log('✓', `Root .env found`);
    log(rootEnv.vars.GEMINI_API_KEY ? '✓' : '✗', 
      `GEMINI_API_KEY: ${rootEnv.vars.GEMINI_API_KEY ? '✓ Set' : '✗ Missing'}`);
    log(rootEnv.vars.GEMINI_MODEL ? '✓' : '✗',
      `GEMINI_MODEL: ${rootEnv.vars.GEMINI_MODEL || 'Missing'}`);
  } else {
    log('✗', 'Root .env not found');
  }

  const frontendEnv = checkEnvFile(path.join(__dirname, 'frontend', '.env'), [
    'VITE_GEMINI_API_KEY',
    'VITE_FIREBASE_API_KEY',
  ]);

  if (frontendEnv.exists) {
    log('✓', `Frontend .env found`);
    log(frontendEnv.vars.VITE_GEMINI_API_KEY ? '✓' : '⚠', 
      `VITE_GEMINI_API_KEY: ${frontendEnv.vars.VITE_GEMINI_API_KEY ? '✓ Set' : '⚠ Optional'}`);
  } else {
    log('✗', 'Frontend .env not found');
  }

  // Check dependencies
  console.log(`\n${colors.blue}📦 Checking Dependencies...${colors.reset}\n`);
  
  const rootPackage = fs.existsSync(path.join(__dirname, 'package.json'));
  const rootNodeModules = fs.existsSync(path.join(__dirname, 'node_modules'));
  const frontendNodeModules = fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'));

  log(rootPackage ? '✓' : '✗', 'Root package.json exists');
  log(rootNodeModules ? '✓' : '✗', 'Root node_modules installed');
  log(frontendNodeModules ? '✓' : '✗', 'Frontend node_modules installed');

  if (!rootNodeModules) {
    log('⚠', 'Run: npm install');
  }
  if (!frontendNodeModules) {
    log('⚠', 'Run: cd frontend && npm install');
  }

  // Check server status
  console.log(`\n${colors.blue}🔗 Checking Servers...${colors.reset}\n`);
  
  const backendHealth = await checkBackendHealth();
  if (backendHealth.ok) {
    log('✓', 'Backend server is running on http://localhost:3001');
  } else {
    log('✗', 'Backend server NOT running on http://localhost:3001');
    log('ℹ', 'Start it with: npm run dev');
  }

  if (backendHealth.ok) {
    const apiTest = await testChatbotAPI();
    log(apiTest.ok ? '✓' : '⚠', 
      `API /api/chatbot: ${apiTest.ok ? 'Working ✓' : 'Check response'}`);
  }

  // Check Vite proxy
  console.log(`\n${colors.blue}⚙️  Checking Vite Configuration...${colors.reset}\n`);
  
  const viteConfig = fs.readFileSync(path.join(__dirname, 'frontend', 'vite.config.ts'), 'utf-8');
  const hasProxy = viteConfig.includes("'/api/chatbot'") || viteConfig.includes("'/api'");
  log(hasProxy ? '✓' : '✗', 'Vite proxy configured for /api');

  // Summary
  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);
  
  const allGood = rootEnv.exists && backendHealth.ok && rootNodeModules && hasProxy;
  
  if (allGood) {
    console.log(`${colors.green}✓ All systems operational!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Make sure both servers are running`);
    console.log(`  2. Open http://localhost:5173 in browser`);
    console.log(`  3. Try the chatbot!`);
  } else {
    console.log(`${colors.yellow}⚠ Some issues detected${colors.reset}`);
    console.log(`\n${colors.cyan}To fix:${colors.reset}`);
    if (!rootNodeModules) console.log(`  • npm install`);
    if (!frontendNodeModules) console.log(`  • cd frontend && npm install`);
    if (!backendHealth.ok) console.log(`  • npm run dev (in root directory)`);
    if (!rootEnv.exists) console.log(`  • Create .env file with GEMINI_API_KEY`);
  }

  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);
}

// Run diagnostics
runDiagnostics().catch(console.error);
