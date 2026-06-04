// Chatbot API service — calls Express backend /api/chatbot
export async function sendChatMessage(
  prompt: string,
  base64Image?: string | null
): Promise<string> {
  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, base64Image }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'សុំទោស មិនអាចឆ្លើយបានទេ';
  } catch (error) {
    console.error('Chatbot API error:', error);
    const fallbacks = [
      'សួស្តីប្អូន! ខ្ញុំគឺ Rotana AI។ ខ្ញុំនៅទីនេះដើម្បីជួយប្អូនរៀនសូត្រ។',
      'អរគុណដែលសួរ! ខ្ញុំអាចជួយប្អូនក្នុងការរៀន Web Development, Programming។',
      'ប្អូនអាចសួរខ្ញុំអំពី HTML, CSS, JavaScript, Python បាន។',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
