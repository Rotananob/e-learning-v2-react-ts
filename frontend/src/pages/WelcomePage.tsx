import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CookieConsent from '../components/common/CookieConsent';

export default function WelcomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('/assets/img/default-avatar.png');
  const fileRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert('🚪 អ្នកបានចាកចេញហើយ!');
    navigate('/login');
  };

  const displayName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'អ្នកប្រើប្រាស់');

  return (
    <>
      <div style={{
        margin: 0, fontFamily: "'Dongrek','Noto Sans Khmer',sans-serif",
        background: darkMode ? '#1a252f' : 'linear-gradient(135deg,#f5f7fa 0%,#e9ecef 100%)',
        color: darkMode ? '#ecf0f1' : '#2c3e50', minHeight: '100vh',
        transition: 'background 0.4s, color 0.4s',
      }}>
        {/* Topbar */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 32px',
          background: darkMode ? 'linear-gradient(90deg,#2c3e50,#34495e)' : 'linear-gradient(90deg,#1a472a,#1f5c3d)',
          color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: 26, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 'bold' }}>
            <i className="fa fa-graduation-cap" style={{ color: '#fbbf24' }} />
            Rotana Education <i className="fa fa-book" />
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '10px 22px', fontSize: 17, fontWeight: 'bold', border: 'none',
              borderRadius: 8, cursor: 'pointer', color: 'white',
              background: darkMode ? 'linear-gradient(135deg,#1f5c3d,#2d7c4e)' : 'linear-gradient(135deg,#1a472a,#1f5c3d)',
            }}
          >
            <i className={`fa fa-${darkMode ? 'sun' : 'moon'}`} /> {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Main Section */}
        <section style={{ padding: '60px 20px 40px', minHeight: '70vh' }}>
          <div style={{
            background: darkMode ? 'rgba(40,50,60,0.98)' : 'rgba(255,255,255,0.98)',
            padding: '48px 32px', borderRadius: 16, textAlign: 'center',
            boxShadow: '0 4px 16px rgba(26,71,42,0.1)', maxWidth: 540,
            margin: '0 auto', border: '1px solid rgba(26,71,42,0.05)', position: 'relative', overflow: 'hidden',
          }}>
            <img src="/assets/img/images/logo.png" alt="Logo"
              style={{ height: 80, width: 80, borderRadius: 18, boxShadow: '0 2px 12px #38bdf833', marginBottom: 18, objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=1a472a&color=fff'; }}
            />
            <h1 style={{ fontSize: 30, marginBottom: 12, color: '#1f5c3d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontWeight: 700 }}>
              <i className="fa fa-hand-peace" />
              សូមស្វាគមន៍ <span style={{ color: '#2563eb' }}>{displayName}</span>
              <i className="fa fa-champagne-glasses" />
            </h1>
            <h4 style={{ fontSize: 15, marginBottom: 20, color: '#4b6b5a' }}>
              <b><i className="fa fa-image" /> ដាក់រូបអ្នកនៅកន្លែង Choose file</b>
            </h4>

            {/* Avatar */}
            <div style={{ marginBottom: 20 }}>
              <img src={avatarSrc} alt="Avatar" width={120} height={120}
                style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #1a472a' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=1a472a&color=fff'; }}
              />
              <br />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginTop: 10 }} />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary">
                <i className="fa fa-book-open" /> ចាប់ផ្ដើមចូលរៀន
              </Link>
              <Link to="/profile-sitting" className="btn btn-primary">
                <i className="fa fa-user-gear" /> ធ្វើប្រវត្តិរូប
              </Link>
              <button onClick={handleLogout} className="btn btn-danger">
                <i className="fa fa-sign-out-alt" /> ចាកចេញ
              </button>
            </div>

            <footer style={{ marginTop: 20, fontSize: 13, color: '#7f8c8d' }}>
              last updates page 13/08/2025 © Rotana Education
            </footer>
          </div>

          {/* Features Grid */}
          <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 10px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, marginBottom: 22, color: darkMode ? '#ecf0f1' : '#2c3e50' }}>
              <i className="fa fa-sparkles" /> អ្វីដែលអ្នកនឹងទទួលបានពេលរៀន <i className="fa fa-thumbs-up" />
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
              {[
                { icon: 'fa-chalkboard-teacher', text: 'អ្នកបង្រៀនមានបទពិសោធន៍' },
                { icon: 'fa-video', text: 'វីដេអូរាប់ពាន់សម្រាប់រៀន' },
                { icon: 'fa-laptop-code', text: 'ចេះបង្កើត Website និង App' },
                { icon: 'fa-pen-nib', text: 'មេរៀនខ្មែរ + អង់គ្លេស' },
                { icon: 'fa-globe-asia', text: 'រៀនបានគ្រប់ទីកន្លែង' },
                { icon: 'fa-cogs', text: 'ដោះស្រាយបញ្ហាក្នុងសាលា' },
                { icon: 'fa-chart-line', text: 'បង្កើនចំណេះដឹង' },
                { icon: 'fa-toolbox', text: 'ចាប់ផ្ដើម Freelancer' },
                { icon: 'fa-book', text: 'មេរៀនចែងជាកញ្ជប់ៗ' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: darkMode ? '#2c3e50' : 'white',
                  borderRadius: 12, padding: '24px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                  color: darkMode ? '#ecf0f1' : '#2c3e50', border: '2px solid #ecf0f1',
                  fontWeight: 'bold', fontSize: 16, transition: 'all 0.3s', cursor: 'default',
                }}>
                  <i className={`fa ${item.icon}`} style={{ fontSize: '1.6em', color: '#3498db' }} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <CookieConsent />
    </>
  );
}
