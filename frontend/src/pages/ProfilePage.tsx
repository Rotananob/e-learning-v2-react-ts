import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setMessage('✅ ធ្វើបច្ចុប្បន្នភាព Profile ដោយជោគជ័យ!');
      }
    } catch {
      setError('❌ មានបញ្ហាក្នុងការ Update Profile។');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', color: '#F8FAFC', fontFamily: "'Noto Sans Khmer',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'rgba(30,41,59,0.85)', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 480, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/img/images/logo.png" alt="Logo" style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', marginBottom: 14 }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }} />
          <h1 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⚙️ ការកំណត់ Profile
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>{currentUser?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>ឈ្មោះបង្ហាញ</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ឈ្មោះរបស់អ្នក"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#F8FAFC', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>Email (មិនអាចប្ដូរបានទេ)</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: '#64748b', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', cursor: 'not-allowed' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#2563EB,#06D6A0)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'កំពុង Save...' : '💾 Save Changes'}
          </button>
        </form>

        {message && <p style={{ color: '#22c55e', textAlign: 'center', marginTop: 14, fontWeight: 600 }}>{message}</p>}
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: 14, fontWeight: 600 }}>{error}</p>}

        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ color: '#60a5fa', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
          <Link to="/welcome" style={{ color: '#60a5fa', fontSize: 14, textDecoration: 'none' }}>Welcome Page</Link>
          <Link to="/forget" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Reset Password</Link>
        </div>
      </div>
    </div>
  );
}
