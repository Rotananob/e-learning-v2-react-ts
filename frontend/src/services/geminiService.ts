/**
 * 🤖 Gemini AI Service
 * Complete service for interacting with Google Gemini API
 * 
 * USAGE:
 * ------
 * import { sendChatMessage, analyzeImage } from '@/services/geminiService';
 * 
 * // Text chat
 * const response = await sendChatMessage('សូមបង្រៀនខ្ញុំពីJavaScript');
 * 
 * // Image analysis
 * const imageResponse = await analyzeImage(base64Image, 'តើលេខក្នុងរូបភាពនេះជាលេខប៉ុន្មាន?');
 */

// Configuration - ensure VITE_GEMINI_API_KEY is set in frontend/.env
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-1.5-flash';

/**
 * System prompt for Rotana E-Learning AI
 * Defines personality, language style, and scope
 */
const SYSTEM_PROMPT = `អ្នកគឺជា Rotana E-Learning AI ដែលបង្កើតដោយ "Rotana NOB" (ណុប រតនា)។

វាចាប់ផ្តើមប្រើប្រាស់:
- ប្រើភាសាខ្មែរធម្មតាដូចមនុស្សពិត
- ប្រើពាក្យដូចជា "ហ្នឹង", "អត់", "មែនតើ", "បាទបង", "ចា៎ប្អូន", "ម៉េចដែរ"
- ហៅអ្នកប្រើប្រាស់ថា "ប្អូន" ឬ "បង"
- និយាយដូចបងប្អូនជិតស្និទ្ធ មិនមែនផ្លូវការ
- ជួយអប់រំដោយភាពរីករាយ

វិស័យឯកទេស:
- HTML, CSS, JavaScript, TypeScript
- React, Vue, Angular
- Python, Java, C++
- Web Development, Mobile Development
- Database (SQL, NoSQL)
- Cloud Services

ឥរិយាបថ:
- ឆ្លើយសំណួរយ៉ាងលម្អិត
- ផ្តល់ឧទាហរណ៍កូដ
- ផ្តល់ដំណោះស្រាយបន្ថែម
- ប្រឹងប្រែងលើការរៀនសូត្រ

វេបសាយ: https://rotana-elearningg.web.app`;

/**
 * Send text message to Gemini AI via backend server
 * @param {string} prompt - The user's question or prompt
 * @param {string|null} base64Image - Optional base64 encoded image
 * @returns {Promise<string>} - AI response
 */
export async function sendChatMessage(
  prompt: string,
  base64Image?: string | null
): Promise<string> {
  try {
    // Backend endpoint handles API key securely
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        base64Image,
        systemPrompt: SYSTEM_PROMPT 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'សុំទោស មិនអាចឆ្លើយបានទេ';
  } catch (error) {
    console.error('❌ Chatbot API error:', error);
    return getRandomFallbackResponse();
  }
}

/**
 * Analyze an image with Gemini
 * @param {string} base64Image - Base64 encoded image
 * @param {string} question - Question about the image
 * @returns {Promise<string>} - Analysis result
 */
export async function analyzeImage(
  base64Image: string,
  question: string
): Promise<string> {
  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: question,
        base64Image,
      }),
    });

    if (!response.ok) {
      throw new Error(`Image analysis failed: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'មិនអាចវិश្លේษណ៍រូបភាពបានទេ';
  } catch (error) {
    console.error('❌ Image analysis error:', error);
    return 'សូមលម្អិតម៉ាងទៀត';
  }
}

/**
 * Get random fallback response when API fails
 */
function getRandomFallbackResponse(): string {
  const fallbacks = [
    'សួស្តីប្អូន! ខ្ញុំគឺ Rotana AI។ ខ្ញុំនៅទីនេះដើម្បីជួយប្អូនរៀនសូត្រ។',
    'អរគុណដែលសួរ! ខ្ញុំអាចជួយប្អូនក្នុងការរៀន Web Development, Programming។',
    'ប្អូនអាចសួរខ្ញុំអំពី HTML, CSS, JavaScript, Python បាន។',
    'ខ្ញុំដូចជាមានបញ្ហាបន្តិច។ សូមព្យាយាមម៉ាងទៀត។',
    'នេះម៉ាងគេឆាប់ឡើង សូមរង់ចាំ...',
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/**
 * Validate if Gemini API key is configured
 * @returns {boolean} - True if API key is set
 */
export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}

/**
 * Get API status
 * @returns {Object} - Configuration status
 */
export function getGeminiStatus() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return {
    configured: !!key,
    model: GEMINI_MODEL,
    keyPreview: key ? `${key.substring(0, 10)}...` : 'NOT SET',
    endpoint: GEMINI_API_ENDPOINT,
  };
}
