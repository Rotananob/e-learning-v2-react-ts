import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC', fontFamily: "'Noto Sans Khmer',sans-serif", textAlign: 'center', padding: 20 }}>
      <img src="/assets/img/images/notfound.jpg" alt="Not Found" style={{ width: 240, borderRadius: 20, marginBottom: 28, opacity: 0.85, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <h1 style={{ fontSize: '5rem', fontWeight: 'bold', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', marginTop: 12, marginBottom: 12, color: '#94a3b8' }}>🔍 រកមិនឃើញទំព័រនេះ</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: 16, maxWidth: 400, lineHeight: 1.7 }}>
        ទំព័រដែលអ្នករកមិនមានទេ ឬប្រហែលជាត្រូវបានផ្លាស់ប្ដូររួចហើយ។
      </p>
      <Link to="/" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#2563EB,#06D6A0)', color: 'white', borderRadius: 14, textDecoration: 'none', fontWeight: 'bold', fontSize: 16 }}>
        🏠 ត្រឡប់ទំព័រដើម
      </Link>
    </div>
  );
}
