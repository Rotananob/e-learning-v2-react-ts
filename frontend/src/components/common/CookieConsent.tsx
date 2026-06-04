import { useEffect, useState } from 'react';

const COOKIE_KEY = 'rotana_cookie_consent';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => { setCookie(COOKIE_KEY, 'accepted', 365); setVisible(false); };
  const reject = () => { setCookie(COOKIE_KEY, 'rejected', 365); setVisible(false); };

  return (
    <div className="cookie-banner">
      <span style={{ fontSize: '0.95em', flex: 1 }}>
        <i className="fa fa-cookie-bite" style={{ marginRight: 8 }} />
        វេបសាយនេះប្រើ Cookies ដើម្បីបង្កើនបទពិសោធន៍អ្នកប្រើប្រាស់។{' '}
        <a href="/privacy-policy" style={{ color: '#ffe066', textDecoration: 'underline' }}>
          គោលការណ៍ឯកជនភាព
        </a>
      </span>
      <button onClick={accept} style={{ background: '#22c55e', color: '#fff' }}>
        យល់ព្រម
      </button>
      <button onClick={reject} style={{ background: '#ef4444', color: '#fff' }}>
        បដិសេធ
      </button>
    </div>
  );
}
