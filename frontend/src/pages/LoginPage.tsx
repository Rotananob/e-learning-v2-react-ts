import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CookieConsent from '../components/common/CookieConsent';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Show success notification
      showNotif(`ចូលបានជោគជ័យ!✅ ត្រូវខិតខំរៀន!`);
      setTimeout(() => navigate('/welcome'), 2800);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case 'auth/user-not-found':
          setError('អ៊ីមែលនេះមិនទាន់បានចុះឈ្មោះទេ។'); break;
        case 'auth/wrong-password':
          setError('ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។'); break;
        case 'auth/invalid-email':
          setError('អ៊ីមែលមិនត្រឹមត្រូវទេ។'); break;
        default:
          setError('Gmail ឬ Password មិនត្រឹមត្រូវ។ ព្យាយាមម្ដងទៀត 🥲');
      }
    } finally {
      setLoading(false);
    }
  };

  function showNotif(msg: string) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', top: '32px', left: '50%', transform: 'translateX(-50%)',
      background: '#22c55e', color: '#fff', padding: '18px 28px',
      borderRadius: '14px', boxShadow: '0 4px 24px #0003',
      fontSize: '1.1em', zIndex: '99999', textAlign: 'center',
      fontWeight: 'bold', transition: 'opacity 0.4s',
      fontFamily: "'Angkor','Noto Sans Khmer',Arial,sans-serif",
    });
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; }, 2400);
    setTimeout(() => el.remove(), 2900);
  }

  return (
    <>
      <div className="auth-bg">
        {/* Version Badge */}
        <div style={{
          position: 'fixed', bottom: 18, right: 18, zIndex: 9999,
          fontSize: '1.1rem', color: '#fff',
          background: 'linear-gradient(90deg,#2563eb 60%,#06d6a0 100%)',
          padding: '10px 24px', borderRadius: 18, boxShadow: '0 4px 18px #0002',
          fontWeight: 'bold', letterSpacing: 1, border: '2px solid #fff3',
          display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none',
        }}>
          <i className="fa fa-rocket" style={{ color: '#ffd700' }} /> Version 2.0 React
        </div>

        <div className="auth-box">
          {/* Logo + Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <img
              src="/assets/img/images/logo.png"
              alt="Rotana E-Learning"
              style={{ width: 56, height: 56, borderRadius: 14, boxShadow: '0 2px 10px #2563eb33', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }}
            />
            <h2>
              <i className="fa fa-lock" style={{ color: '#2563eb', marginRight: 8 }} />
              ចូលគណនី
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="អ៊ីមែល"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="ពាក្យសម្ងាត់"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="submit"
              className={`auth-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'កំពុងចូល...' : <>
                <i className="fa fa-sign-in-alt" /> ចូល
              </>}
            </button>
          </form>

          {error && <p className="auth-error">{error}</p>}

          <p style={{ marginTop: 14 }}>
            <Link to="/forget">ភ្លេចពាក្យសម្ងាត់?</Link>
          </p>
          <p>
            មិនទាន់មានគណនី?{' '}
            <Link to="/register">ចុះឈ្មោះ</Link>
          </p>
          <p>
            <Link to="/">← ទំព័រដើម</Link>
          </p>
        </div>

        <footer style={{ marginTop: 20, fontSize: 13, color: '#fff', textAlign: 'center', opacity: 0.9 }}>
          © last updates UI 12/Dec/2024 | ដោយ <strong>Rotana NOB</strong>
        </footer>
      </div>
      <CookieConsent />
    </>
  );
}
