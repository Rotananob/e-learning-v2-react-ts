import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CookieConsent from '../components/common/CookieConsent';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា។');
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.username);
      alert('✅ ចុះឈ្មោះដោយជោគជ័យ! សូមចូលប្រើប្រាស់។');
      navigate('/login');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case 'auth/email-already-in-use':
          setError('អ៊ីមែលនេះបានប្រើរួចហើយ។'); break;
        case 'auth/invalid-email':
          setError('អ៊ីមែលមិនត្រឹមត្រូវ។'); break;
        case 'auth/weak-password':
          setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួ។'); break;
        default:
          setError('មានកំហុសក្នុងការចុះឈ្មោះ។');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-bg">
        <div className="auth-box">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <img
              src="/assets/img/images/logo.png"
              alt="Rotana E-Learning"
              style={{ width: 56, height: 56, borderRadius: 14, boxShadow: '0 2px 10px #2563eb33', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }}
            />
            <h2>
              <i className="fa fa-user-plus" style={{ color: '#2563eb', marginRight: 8 }} />
              ចុះឈ្មោះ
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="ឈ្មោះពិតរបស់អ្នក" value={form.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="អ៊ីមែល" value={form.email} onChange={handleChange} required autoComplete="email" />
            <input type="password" name="password" placeholder="ពាក្យសម្ងាត់" value={form.password} onChange={handleChange} required autoComplete="new-password" />
            <input type="password" name="confirm" placeholder="បញ្ជាក់ពាក្យសម្ងាត់" value={form.confirm} onChange={handleChange} required autoComplete="new-password" />
            <button type="submit" className={`auth-btn${loading ? ' loading' : ''}`} disabled={loading}>
              {loading ? 'កំពុងចុះឈ្មោះ...' : <><i className="fa fa-user-plus" /> ចុះឈ្មោះ</>}
            </button>
          </form>

          {/* Info banner */}
          <div style={{ margin: '14px 0 0', padding: '14px', background: 'linear-gradient(90deg,#22c55e 60%,#38bdf8 100%)', color: '#fff', borderRadius: 12, fontSize: '1em', fontWeight: 700, textAlign: 'center' }}>
            <span style={{ fontSize: '1.2em' }}>ចុះឈ្មោះបានភ្លាមៗ</span><br />
            មិនចាំបាច់បញ្ជាក់អ៊ីមែលឬមកបំពេញកូដអីទេ។ ងាយស្រួលសម្រាប់អ្នកចង់រៀន <b>Free</b> ទាំងអស់គ្នា។
          </div>

          {error && <p className="auth-error">{error}</p>}

          <p>មានគណនីរួចហើយ? <Link to="/login">ចូល</Link></p>
          <p style={{ color: 'red', fontSize: 13 }}>មុខងារចុះឈ្មោះនេះនឹងបិទចុងខែនេះហើយ — <Link to="/reason">ហេតុអ្វី?</Link></p>
        </div>
        <footer style={{ marginTop: 20, fontSize: 13, color: '#fff', textAlign: 'center', opacity: 0.9 }}>
          © ១២/កក្កដា/២០២៥ Powered by <strong>Rotana NOB</strong>
        </footer>
      </div>
      <CookieConsent />
    </>
  );
}
