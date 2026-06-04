import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('សិស្សសកម្មរបស់ Rotana Education');
  const [phone, setPhone] = useState('012 345 678');
  const [facebook, setFacebook] = useState('https://facebook.com/yourprofile');
  
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', color: '#F8FAFC', fontFamily: "'Noto Sans Khmer',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'rgba(30,41,59,0.85)', borderRadius: 20, padding: '40px 32px', width: '100%', maxWidth: 650, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/img/images/logo.png" alt="Logo" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 14, boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }} />
          <h1 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⚙️ ការកំណត់ Profile កម្រិតខ្ពស់
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>រៀបចំប្រវត្តិរូបរបស់អ្នកឱ្យកាន់តែទាក់ទាញ</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold' }}>
              {(displayName || currentUser?.email || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{displayName || 'ឈ្មោះអ្នកប្រើប្រាស់'}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{currentUser?.email}</div>
            </div>
            <button type="button" style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#f8fafc', cursor: 'pointer', fontSize: 13 }}><i className="fa-solid fa-camera"/> ប្ដូររូប</button>
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}><i className="fa-solid fa-user" style={{ color: '#3b82f6' }}/> ឈ្មោះបង្ហាញ</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ឈ្មោះរបស់អ្នក"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}><i className="fa-solid fa-envelope" style={{ color: '#06D6A0' }}/> Email</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: '#64748b', fontSize: 14, fontFamily: 'inherit', cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}><i className="fa-solid fa-phone" style={{ color: '#f59e0b' }}/> លេខទូរស័ព្ទ</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}><i className="fa-brands fa-facebook" style={{ color: '#3b82f6' }}/> គណនី Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Link Facebook"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 8 }}><i className="fa-solid fa-pen" style={{ color: '#a855f7' }}/> ជីវប្រវត្តិសង្ខេប (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="សរសេរពីខ្លួនអ្នក..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8FAFC', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#2563EB,#06D6A0)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
              {loading ? 'កំពុង Save...' : <><i className="fa-solid fa-floppy-disk"/> រក្សាទុកការកំណត់</>}
            </button>
          </div>
        </form>

        {message && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: 12, borderRadius: 8, textAlign: 'center', marginTop: 20, fontWeight: 600 }}><i className="fa-solid fa-check-circle"/> {message}</div>}
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: 12, borderRadius: 8, textAlign: 'center', marginTop: 20, fontWeight: 600 }}><i className="fa-solid fa-triangle-exclamation"/> {error}</div>}

        <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
          <Link to="/dashboard" style={{ color: '#60a5fa', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}><i className="fa-solid fa-arrow-left"/> ត្រឡប់ទៅ Dashboard</Link>
          <Link to="/welcome" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}><i className="fa-solid fa-house"/> Welcome Page</Link>
        </div>
      </div>
    </div>
  );
}
