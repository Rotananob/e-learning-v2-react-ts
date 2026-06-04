import { useState, useRef, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { sendChatMessage } from '../services/chatbotApi';
import type { ChatMessage } from '../types';

marked.use({ breaks: true });

const HISTORY_KEY = 'rotana_chat_history';

function saveChatHistory(message: string, role: 'user' | 'bot') {
  let history: ChatMessage[] = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch {}
  history.push({ role, content: message, timestamp: Date.now() });
  if (history.length > 20) history = history.slice(-20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadChatHistory(): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sidebarHistory, setSidebarHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSidebarHistory(loadChatHistory());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageB64(result.split(',')[1]);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const clearHistory = () => {
    if (confirm('លុបប្រវត្តិជជែកមែនទេ?')) {
      localStorage.removeItem(HISTORY_KEY);
      setMessages([]);
      setSidebarHistory([]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && !imageB64) return;

    const newMessages: ChatMessage[] = [...messages];
    if (text) {
      newMessages.push({ role: 'user', content: text });
      saveChatHistory(text, 'user');
    }
    if (imageB64) {
      newMessages.push({ role: 'user', content: imageB64, isImage: true });
    }
    setMessages(newMessages);
    setInput('');
    setImageB64(null);
    setImagePreview(null);
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setTyping(true);

    try {
      const reply = await sendChatMessage(text || 'ជួយមើលរូបនេះបន្តិច', imageB64);
      const botMsg: ChatMessage = { role: 'bot', content: reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      saveChatHistory(reply, 'bot');
      setSidebarHistory(loadChatHistory());
    } catch {
      setMessages((prev) => [...prev, {
        role: 'bot',
        content: 'សុំទោសបង/ប្អូន មានបញ្ហាបន្តិច។ ខ្ញុំនៅទីនេះដើម្បីជួយប្អូន 😊',
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as unknown as FormEvent); }
  };

  const renderBotContent = (content: string) => {
    const html = marked.parse(content) as string;
    return <div className="ai-content" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div style={{ background: '#f8fafc', height: '100dvh', overflow: 'hidden', margin: 0, fontFamily: "'Angkor','Kantumruy Pro',sans-serif" }}>
      {/* Background mesh */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#f8fafc', backgroundImage: 'radial-gradient(at 0% 0%,rgba(14,141,233,0.15) 0px,transparent 50%),radial-gradient(at 100% 0%,rgba(99,102,241,0.15) 0px,transparent 50%)' }} />

      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', maxWidth: 1400, margin: '0 auto', padding: '8px 16px' }}>
        {/* Back button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px',
            background: '#026fc7', color: 'white', borderRadius: 12, fontWeight: 'bold',
            textDecoration: 'none', fontSize: 14, boxShadow: '0 2px 8px #0265c744',
          }}>
            <i className="fa fa-arrow-left" /> ត្រឡប់ទៅ ថ្នាក់រៀន
          </Link>
        </div>

        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', marginBottom: 8, background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/img/images/logo.png" alt="Rotana" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8 }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=0e8de9&color=fff'; }} />
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 'bold', background: 'linear-gradient(to right,#0358a1,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                Rotana eLearn AI Assistant
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>សេវាកម្មកំពុងដំណើរការ</span>
              </div>
            </div>
          </div>
          <button onClick={clearHistory} style={{ padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 12 }} title="Clear Chat">
            <i className="fa fa-trash" style={{ fontSize: 18 }} />
          </button>
        </header>

        {/* Main content */}
        <div style={{ flexGrow: 1, display: 'flex', gap: 12, overflow: 'hidden', minHeight: 0 }}>
          {/* Sidebar */}
          <aside style={{ width: '22%', maxWidth: 220, minWidth: 110, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 12, height: '100%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column' }}>
              {/* Top members */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', marginBottom: 8 }}>ក្រុមដំបូង ៥ នាក់</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    { name: 'Rotana NOB', pic: '/assets/img/myPic.jpg', badge: 'Founder' },
                    { name: 'Chan Tola', pic: '/assets/img/tolaPic.jpg' },
                    { name: 'Nob Phearom', pic: '/assets/img/Phearom.jpg' },
                    { name: 'Lim Sophea', pic: null },
                    { name: 'Nhem Dalin', pic: '/assets/img/linPic.jpg' },
                  ].map((m, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12 }}>
                      {m.pic ? (
                        <img src={m.pic} alt={m.name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${m.name}&background=0e8de9&color=fff&size=40`; }} />
                      ) : (
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>{i + 1}</span>
                      )}
                      <span style={{ color: i === 0 ? '#0358a1' : '#475569', fontWeight: i === 0 ? 'bold' : 'normal' }}>
                        {m.name} {m.badge && <small style={{ color: '#6366f1', fontSize: 9 }}>({m.badge})</small>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Chat history */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', marginBottom: 8 }}>ប្រវត្តិជជែក</h2>
                <ul style={{ listStyle: 'none', padding: 0, overflowY: 'auto', maxHeight: 200 }}>
                  {sidebarHistory.length === 0 ? (
                    <li style={{ color: '#94a3b8', fontSize: 12 }}>មិនទាន់មានប្រវត្តិ</li>
                  ) : (
                    sidebarHistory.slice(-10).reverse().map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: 6, fontSize: 11, marginBottom: 4, color: '#475569' }}>
                        <span>{item.role === 'user' ? '🧑‍💻' : '🤖'}</span>
                        <span>{(item.content || '').slice(0, 36)}{item.content?.length > 36 ? '…' : ''}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div style={{ marginTop: 'auto', padding: 12, background: 'linear-gradient(135deg,#026fc7,#6366f1)', borderRadius: 16, color: 'white' }}>
                <p style={{ fontSize: 11, opacity: 0.8 }}>ដៃគូរៀនសូត្រដ៏ឆ្លាតវៃ</p>
                <p style={{ fontSize: 12, fontWeight: 'bold' }}>Rotana E-Learning</p>
              </div>
            </div>
          </aside>

          {/* Chat Main */}
          <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 36, border: '1px solid rgba(255,255,255,0.6)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            {/* Viewport */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {messages.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 24 }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#0e8de9', borderRadius: '50%', filter: 'blur(24px)', opacity: 0.2 }} />
                    <img src="/assets/img/images/logo.png" alt="Rotana AI" style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=0e8de9&color=fff'; }} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 'bold', color: '#1e293b' }}>សួស្តីប្អូន! ខ្ញុំគឺ Rotana AI</h2>
                  <p style={{ color: '#64748b', marginTop: 12, maxWidth: 360, lineHeight: 1.7 }}>
                    ខ្ញុំនៅទីនេះដើម្បីជួយប្អូនក្នុងការរៀនសូត្រ។ ប្អូនអាចសួរសំណួរ ឬផ្ញើររូបភាពលំហាត់មកខ្ញុំបានគ្រប់ពេល!
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'slideUp 0.4s ease' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: msg.role === 'user' ? '12px 20px' : '16px 20px',
                    borderRadius: msg.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                    background: msg.role === 'user' ? '#026fc7' : 'white',
                    color: msg.role === 'user' ? 'white' : '#334155',
                    fontSize: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: msg.role === 'bot' ? '1px solid #f1f5f9' : 'none',
                  }}>
                    {msg.isImage ? (
                      <img src={`data:image/png;base64,${msg.content}`} style={{ maxWidth: '100%', borderRadius: 12 }} alt="uploaded" />
                    ) : msg.role === 'bot' ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <img src="/assets/img/images/logo.png" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #0e8de9' }} alt="AI"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=AI&background=0e8de9&color=fff'; }} />
                          <span style={{ fontWeight: 'bold', color: '#0358a1', fontSize: 12 }}>Rotana AI</span>
                        </div>
                        {renderBotContent(msg.content)}
                      </>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <img src="/assets/img/images/logo.png" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0e8de9' }} alt="AI"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=AI&background=0e8de9&color=fff'; }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map((d) => (
                      <span key={d} style={{ width: 8, height: 8, background: '#0e8de9', borderRadius: '50%', animation: `pulse 1.2s ${d * 0.2}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: '#0e8de9', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>កំពុងស្វែងរកចម្លើយ...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid #f1f5f9' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: '#f8fafc', padding: 8, borderRadius: 32, border: '1.5px solid #e2e8f0', position: 'relative' }}>
                <label style={{ cursor: 'pointer', padding: '10px 12px', color: '#94a3b8', borderRadius: '50%' }} title="Upload Image">
                  <i className="fa fa-image" style={{ fontSize: 22 }} />
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} style={{ width: 36, height: 36, borderRadius: 8, border: '2px solid #0e8de9', objectFit: 'cover' }} alt="preview" />
                )}
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="តើប្អូនចង់សួរអ្វីខ្លះ?..."
                  style={{ flexGrow: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontSize: 14, fontFamily: 'inherit', padding: '8px 4px', overflowY: 'hidden' }}
                />
                <button type="submit" style={{
                  width: 44, height: 44, borderRadius: '50%', border: 'none',
                  background: '#026fc7', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(2,111,199,0.3)', transition: 'all 0.2s',
                }}>
                  <i className="fa fa-paper-plane" style={{ fontSize: 16 }} />
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 10 }}>
                រក្សាសិទ្ធិដោយ © 2024 Rotana E-Learning. AI អាចមានកំហុសឆ្គង។
              </p>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .ai-content { line-height: 1.7; color: #334155; }
        .ai-content p { margin-bottom: 0.75rem; }
        .ai-content ul { padding-left: 1.4rem; margin-bottom: 0.8rem; }
        .ai-content li { margin-bottom: 0.4rem; }
        .ai-content pre { position: relative; border-radius: 10px; margin: 0.6rem 0; overflow-x: auto; }
        .ai-content code { font-size: 13px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
      `}</style>
    </div>
  );
}
