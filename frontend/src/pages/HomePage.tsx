import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CookieConsent from '../components/common/CookieConsent';

const courses = [
  { icon: '🌐', title: 'Web Development', desc: 'HTML, CSS, JavaScript, React' },
  { icon: '🐍', title: 'Python Programming', desc: 'Python, Django, Flask, AI/ML' },
  { icon: '📱', title: 'Mobile Development', desc: 'Android, Flutter, React Native' },
  { icon: '🎮', title: 'Game Development', desc: 'Unity, Pygame, Web Games' },
  { icon: '🗄️', title: 'Database Design', desc: 'MySQL, MongoDB, Firebase' },
  { icon: '🔒', title: 'Cybersecurity', desc: 'Network security, Ethical Hacking' },
];

function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date('2026-01-01T00:00:00');
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
      {[['d', 'ថ្ងៃ'], ['h', 'ម៉ោង'], ['m', 'នាទី'], ['s', 'វិនាទី']].map(([k, label]) => (
        <div key={k} style={{ background: 'rgba(30,41,59,0.9)', borderRadius: 16, padding: '20px 28px', textAlign: 'center', minWidth: 100, border: '1px solid rgba(37,99,235,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: 38, fontWeight: 'bold', color: '#06D6A0' }}>{String(time[k as keyof typeof time]).padStart(2, '0')}</div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [progressWidths, setProgressWidths] = useState([0, 0, 0]);

  useEffect(() => {
    // Animate progress bars
    setTimeout(() => setProgressWidths([75, 45, 30]), 400);
    // PWA standalone detection
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!isStandalone && localStorage.getItem('pwa_installed') === 'true') {
      // Show "open as app" popup
    } else if (isStandalone) {
      localStorage.setItem('pwa_installed', 'true');
    }
  }, []);

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Kantumruy Pro','Noto Sans Khmer',sans-serif", overflowX: 'hidden' }}>

        {/* SEO visible header */}
        <header style={{ padding: '18px 20px 6px', background: 'linear-gradient(180deg,rgba(255,255,255,0.04),transparent)' }}>
          <h1 style={{ margin: 0, fontFamily: "'Angkor','Noto Sans Khmer',sans-serif", fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, background: 'linear-gradient(135deg,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            វេបសាយរៀន IT និង កូដភាសាខ្មែរ
          </h1>
          <h2 style={{ margin: '6px 0 0', fontFamily: "'Noto Sans Khmer',sans-serif", fontSize: '1rem', color: '#334155', fontWeight: 600 }}>
            រៀនសរសេរកូដ បង្កើតកម្មវិធី និងវេបសាយជាភាសាខ្មែរ ឥតគិតថ្លៃ
          </h2>
        </header>

        <div className="container">
          {/* Logo Section */}
          <section style={{ paddingTop: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 16, flexWrap: 'wrap' }}>
              <img
                src="/assets/img/images/logo.png"
                alt="Rotana E-Learning Logo"
                style={{ width: 90, height: 90, borderRadius: 18, boxShadow: '0 4px 20px rgba(37,99,235,0.35)', background: '#fff', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff&size=90'; }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Rotana E-Learning
                </div>
                <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
                  IT & Code រៀនជាភាសាខ្មែរ Free 95%
                </div>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: 680, margin: '0 auto 2rem', lineHeight: 1.7 }}>
              វេទិការៀន IT ឥតគិតថ្លៃ — HTML, CSS, JavaScript, Python, Game Development, Mobile App
              ជាភាសាខ្មែរ ដោយ <strong style={{ color: '#06D6A0' }}>Rotana NOB</strong>
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                <i className="fa fa-sign-in-alt" /> ចូលរៀន
              </Link>
              <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 32px', fontSize: '1.05rem', borderRadius: 14 }}>
                <i className="fa fa-user-plus" /> ចុះឈ្មោះ
              </Link>
              <Link to="/chatbot" className="btn" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white', padding: '14px 32px', fontSize: '1.05rem', borderRadius: 14 }}>
                <i className="fa fa-robot" /> AI Tutor
              </Link>
            </div>
          </section>

          {/* Under Construction / Progress Section */}
          <section style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '2.5rem', marginBottom: '3rem', border: '1px solid rgba(37,99,235,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right,#2563EB,#06D6A0)' }} />
            <div style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🔨</div>
            <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem', color: '#F8FAFC' }}>
              កំពុងសាងសង់វគ្គថ្មីៗ
            </h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              ក្រុមការងាររបស់យើងកំពុងខំប្រឹងធ្វើ <span style={{ color: '#06D6A0', fontWeight: 'bold' }}>វគ្គសិក្សា</span> ថ្មីៗ
              <br />ដើម្បីបំរើ <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>អ្នករៀន IT ជាភាសាខ្មែរ</span>
            </p>

            {/* Progress bars */}
            {[
              { label: 'Web Development (HTML/CSS/JS)', pct: 75 },
              { label: 'Python & Backend', pct: 45 },
              { label: 'Mobile & Game Dev', pct: 30 },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(30,41,59,0.9)', borderRadius: 14, padding: '1.2rem 1.5rem', marginBottom: 16, borderLeft: '4px solid #2563EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 'bold', color: '#F8FAFC' }}>{item.label}</span>
                  <span style={{ color: '#06D6A0', fontWeight: 'bold' }}>{item.pct}%</span>
                </div>
                <div style={{ height: 18, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressWidths[i]}%`, background: 'linear-gradient(to right,#2563EB,#06D6A0)', borderRadius: 10, transition: 'width 1.5s ease-in-out', position: 'relative' }} />
                </div>
              </div>
            ))}
          </section>

          {/* Countdown */}
          <section style={{ background: 'rgba(30,41,59,0.7)', borderRadius: 20, padding: '2.5rem', marginBottom: '3rem', textAlign: 'center', border: '1px solid rgba(37,99,235,0.2)' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#F8FAFC' }}>⏳ រង់ចាំ Launch ជាផ្លូវការ</h3>
            <Countdown />
          </section>

          {/* Courses Preview */}
          <section style={{ marginBottom: '3rem' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem', background: 'linear-gradient(to right,#F8FAFC,#2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              📚 វគ្គដែលនឹងមានក្នុងឆាប់ៗ
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
              {courses.map((c, i) => (
                <div key={i} style={{ background: 'rgba(30,41,59,0.7)', borderRadius: 16, padding: '1.8rem', textAlign: 'center', border: '1px solid rgba(37,99,235,0.1)', transition: 'transform 0.3s,box-shadow 0.3s', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon}</div>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', color: '#F8FAFC' }}>{c.title}</h4>
                  <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>{c.desc}</p>
                  <span style={{ display: 'inline-block', background: '#F59E0B', color: '#0F172A', padding: '5px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 'bold' }}>
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section style={{ textAlign: 'center', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { to: '/about-us', label: '👥 អំពីយើង' },
                { to: '/chatbot', label: '🤖 AI Tutor' },
                { to: '/privacy-policy', label: '🔒 Privacy Policy' },
                { to: '/dashboard', label: '📊 Dashboard' },
              ].map((lk) => (
                <Link key={lk.to} to={lk.to} style={{ color: '#64748b', fontSize: 14, textDecoration: 'none', padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                  {lk.label}
                </Link>
              ))}
            </div>
            <p style={{ color: '#475569', fontSize: 13, marginTop: 24 }}>
              © 2024 Rotana IT E-Learning Hub | Designed by <strong>Rotana NOB</strong>
            </p>
          </section>
        </div>
      </div>
      <CookieConsent />
    </>
  );
}
