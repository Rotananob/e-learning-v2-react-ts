import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', color: '#F8FAFC', fontFamily: "'Noto Sans Khmer',sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: '2rem', background: 'linear-gradient(to right,#2563EB,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>
            🔒 គោលការណ៍ឯកជនភាព
          </h1>
          <p style={{ color: '#64748b' }}>Privacy Policy — Rotana E-Learning</p>
        </div>

        {[
          { title: '1. ព័ត៌មានដែលយើងប្រមូល', content: 'យើងប្រមូល Email, ឈ្មោះ, និងព័ត៌មានប្រើប្រាស់ App ដើម្បីកែលម្អប្រព័ន្ធ។' },
          { title: '2. របៀបប្រើប្រាស់ព័ត៌មាន', content: 'ព័ត៌មានត្រូវបានប្រើដើម្បី: ផ្ដល់សេវា Authentication, ផ្ទុកវឌ្ឍនភាពរៀន, ផ្ញើ Notification ពាក់ព័ន្ធ។' },
          { title: '3. Cookies', content: 'យើងប្រើ Cookies ដើម្បីរក្សាទុក Session Login និងចំណូលចិត្ត (favorites) ។' },
          { title: '4. Firebase / Google', content: 'យើងប្រើ Firebase Auth និង Firestore ដែលគ្រប់គ្រងដោយ Google LLC។ ព័ត៌មានរបស់អ្នកមានសុវត្ថិភាពស្រប​តាម Privacy Policy របស់ Google។' },
          { title: '5. ការចែករំលែក', content: 'យើង មិន លក់ ឬចែករំលែកព័ត៌មានផ្ទាល់ខ្លួនទៅភាគីទីបីដោយគ្មានការអនុញ្ញាតទេ។' },
          { title: '6. ការទាក់ទង', content: 'បើមានសំណួរ សូមទំនាក់ទំនង: rotananob.dev@gmail.com' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(30,41,59,0.6)', borderRadius: 14, padding: '20px 24px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ color: '#60a5fa', fontSize: '1.1rem', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14 }}>{s.content}</p>
          </div>
        ))}

        <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          Last updated: December 2024 | © Rotana NOB
        </p>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>← ត្រឡប់ទំព័រដើម</Link>
        </div>
      </div>
    </div>
  );
}
