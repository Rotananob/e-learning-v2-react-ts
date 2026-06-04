import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('✅ យើងបានផ្ញើលិខិត Reset Password ទៅ Email របស់អ្នកហើយ!');
    } catch {
      setError('❌ មិនអាចផ្ញើបាន។ សូមពិនិត្យ Email ម្ដងទៀត។');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-box">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <img src="/assets/img/images/logo.png" alt="Logo"
            style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 8px #2563eb33' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }}
          />
          <h2><i className="fa fa-key" style={{ color: '#2563eb', marginRight: 8 }} />ភ្លេចពាក្យសម្ងាត់</h2>
        </div>
        <p style={{ color: '#555', marginBottom: 18, fontSize: 14 }}>
          បញ្ចូល Email អ្នក ហើយយើងនឹងផ្ញើ Link Reset Password ទៅ។
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="អ៊ីមែល"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit" className={`auth-btn${loading ? ' loading' : ''}`} disabled={loading}>
            {loading ? 'កំពុងផ្ញើ...' : <><i className="fa fa-paper-plane" /> ផ្ញើ Reset Link</>}
          </button>
        </form>
        {message && <p style={{ color: '#22c55e', fontWeight: 600, marginTop: 14 }}>{message}</p>}
        {error && <p className="auth-error">{error}</p>}
        <p style={{ marginTop: 16 }}><Link to="/login">← ត្រឡប់ទៅចូល</Link></p>
      </div>
    </div>
  );
}
