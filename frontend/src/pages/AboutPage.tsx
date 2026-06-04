import { Link } from 'react-router-dom';

const team = [
  { name: 'Rotana NOB', role: 'Founder & Lead Developer', pic: '/assets/img/myPic.jpg', desc: 'Web Developer, AI Enthusiast, Educator' },
  { name: 'Chan Tola', role: 'Co-Developer', pic: '/assets/img/tolaPic.jpg', desc: 'Front-end Developer' },
  { name: 'Nob Phearom', role: 'Content Creator', pic: '/assets/img/Phearom.jpg', desc: 'IT & Education Content' },
  { name: 'Nhem Dalin', role: 'Designer', pic: '/assets/img/linPic.jpg', desc: 'UI/UX Designer' },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', color: '#F8FAFC', fontFamily: "'Noto Sans Khmer',sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img src="/assets/img/images/logo.png" alt="Logo" style={{ width: 80, height: 80, borderRadius: 18, objectFit: 'cover', marginBottom: 16 }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }} />
          <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>
            អំពី Rotana E-Learning
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            Rotana E-Learning គឺជាវេទិការៀន IT ឥតគិតថ្លៃសម្រាប់ប្រជាជនខ្មែរ។ ក្រុមការងាររបស់យើងរៀបចំមេរៀន
            HTML, CSS, JavaScript, Python, Game Development ជាភាសាខ្មែរ ដើម្បីធ្វើឲ្យការសិក្សា IT
            ប្រើប្រាស់បានងាយស្រួលសម្រាប់គ្រប់គ្នា។
          </p>
        </div>

        {/* Mission */}
        <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 16, padding: '28px 32px', marginBottom: 36, textAlign: 'center' }}>
          <h2 style={{ color: '#06D6A0', fontSize: '1.5rem', marginBottom: 12 }}>🎯 បេសកកម្ម</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 15 }}>
            ធ្វើឲ្យអ្នករៀន IT ខ្មែរ <strong style={{ color: '#F8FAFC' }}>ចូលដំណើរការចំណេះដឹង IT ទំនើបៗ</strong> ដោយ
            ឥតគិតថ្លៃ ជាភាសាខ្មែរ — ពីគ្រឹះ HTML រហូតដល់ AI, Mobile App, Game Development។
          </p>
        </div>

        {/* Team */}
        <h2 style={{ textAlign: 'center', color: '#F8FAFC', fontSize: '1.8rem', marginBottom: 28 }}>👥 ក្រុមការងារ</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
          {team.map((m, i) => (
            <div key={i} style={{ background: 'rgba(30,41,59,0.7)', borderRadius: 16, padding: '24px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}>
              <img src={m.pic} alt={m.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', marginBottom: 14 }}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${m.name}&background=2563eb&color=fff&size=80`; }} />
              <h3 style={{ color: '#60a5fa', fontSize: 15, marginBottom: 4 }}>{m.name}</h3>
              <div style={{ color: '#06D6A0', fontSize: 12, marginBottom: 8 }}>{m.role}</div>
              <p style={{ color: '#64748b', fontSize: 13 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#2563EB,#06D6A0)', color: 'white', borderRadius: 14, textDecoration: 'none', fontWeight: 'bold' }}>
            ← ត្រឡប់ទំព័រដើម
          </Link>
        </div>
      </div>
    </div>
  );
}
