import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoModal from '../components/common/VideoModal';
import { formatKhmer, useLearningTimer } from '../hooks/useLearningTimer';
import type { Favorite, Course } from '../types';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getWeekId } from '../hooks/useLearningTimer';

// ======= EXTENDED COURSES DATA =======
const defaultCourses: Course[] = [
  {
    id: 'web-basic', title: 'Web Basic (HTML/CSS/JS)', category: 'Web Development',
    description: 'រៀន HTML, CSS, JavaScript ពីដំបូង', icon: <i className="fa-solid fa-globe" />,
    lessons: [
      { name: 'HTML Intro', link: 'https://www.youtube.com/embed/qz0aGYrrlhU' },
      { name: 'CSS Basics', link: 'https://www.youtube.com/embed/yfoY53QXEnI' },
      { name: 'JavaScript Basics', link: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
      { name: 'DOM Manipulation', link: 'https://www.youtube.com/embed/y17RuWUpclg' },
    ]
  },
  {
    id: 'tailwind', title: 'Tailwind CSS', category: 'Web Development',
    description: 'រចនា Website យ៉ាងលឿនជាមួយ Tailwind', icon: <i className="fa-brands fa-css3-alt" />,
    lessons: [
      { name: 'Tailwind Crash Course', link: 'https://www.youtube.com/embed/UBOj6rqRUME' },
      { name: 'Responsive Design', link: 'https://www.youtube.com/embed/t9tEVtB7v-w' },
    ]
  },
  {
    id: 'react', title: 'React JS', category: 'Web Development',
    description: 'React.js + Hooks + TypeScript', icon: <i className="fa-brands fa-react" />,
    lessons: [
      { name: 'React Intro', link: 'https://www.youtube.com/embed/w7ejDZ8SWv8' },
      { name: 'React Hooks', link: 'https://www.youtube.com/embed/dpw9EHDh2bM' },
      { name: 'React Router', link: 'https://www.youtube.com/embed/Ul3y1LXxzdU' },
    ]
  },
  {
    id: 'nextjs', title: 'Next.js (Fullstack)', category: 'Web Development',
    description: 'Next.js 14 App Router, Server Actions', icon: <i className="fa-brands fa-neos" />,
    lessons: [
      { name: 'Next.js Crash Course', link: 'https://www.youtube.com/embed/ZjAqacIC_3c' },
    ]
  },
  {
    id: 'node', title: 'Node.js Backend', category: 'Web Development',
    description: 'Node.js, Express, MongoDB', icon: <i className="fa-brands fa-node-js" />,
    lessons: [
      { name: 'Node.js Intro', link: 'https://www.youtube.com/embed/TlB_eWDSMt4' },
      { name: 'Express.js Crash Course', link: 'https://www.youtube.com/embed/L72fhGm1tfE' },
      { name: 'MongoDB Basics', link: 'https://www.youtube.com/embed/-56x56UppqQ' },
    ]
  },
  {
    id: 'php-mysql', title: 'PHP & MySQL', category: 'Web Development',
    description: 'បង្កើត Backend ជាមួយ PHP នឹង MySQL', icon: <i className="fa-brands fa-php" />,
    lessons: [
      { name: 'PHP Tutorial', link: 'https://www.youtube.com/embed/OK_JCtrrv-c' },
      { name: 'MySQL Database', link: 'https://www.youtube.com/embed/7S_tz1z_5bA' },
    ]
  },
  {
    id: 'python', title: 'Python Programming', category: 'Programming',
    description: 'Python ពីចាប់ផ្ដើមដល់ Advanced', icon: <i className="fa-brands fa-python" />,
    lessons: [
      { name: 'Python Intro', link: 'https://www.youtube.com/embed/rfscVS0vtbw' },
      { name: 'Python OOP', link: 'https://www.youtube.com/embed/Ej_02ICOIgs' },
      { name: 'Python Project', link: 'https://www.youtube.com/embed/8ext9G7xspg' },
    ]
  },
  {
    id: 'c', title: 'C Programming', category: 'Programming',
    description: 'មូលដ្ឋានគ្រឹះនៃកូដ C', icon: <i className="fa-solid fa-code" />,
    lessons: [
      { name: 'C Tutorial', link: 'https://www.youtube.com/embed/KJgsSFOSQv0' },
    ]
  },
  {
    id: 'cpp', title: 'C++ Programming', category: 'Programming',
    description: 'C++ សម្រាប់អ្នកចាប់ផ្ដើម', icon: <i className="fa-solid fa-c" />,
    lessons: [
      { name: 'C++ Basics', link: 'https://www.youtube.com/embed/vLnPwxZdW4Y' },
      { name: 'C++ Pointers', link: 'https://www.youtube.com/embed/zuegQmMdy8M' },
    ]
  },
  {
    id: 'java', title: 'Java Programming', category: 'Programming',
    description: 'Java OOP នឹងគម្រោង', icon: <i className="fa-brands fa-java" />,
    lessons: [
      { name: 'Java Intro', link: 'https://www.youtube.com/embed/eIrMbAQSU34' },
      { name: 'Java OOP', link: 'https://www.youtube.com/embed/a199KZGMNxk' },
    ]
  },
  {
    id: 'csharp', title: 'C# .NET', category: 'Programming',
    description: 'C# បង្កើតកម្មវិធី Windows', icon: <i className="fa-brands fa-windows" />,
    lessons: [
      { name: 'C# Crash Course', link: 'https://www.youtube.com/embed/GhQdlIFylQ8' },
    ]
  },
  {
    id: 'flutter', title: 'Flutter / Mobile Dev', category: 'Mobile',
    description: 'Flutter, Dart, Android App', icon: <i className="fa-solid fa-mobile-screen" />,
    lessons: [
      { name: 'Flutter Intro', link: 'https://www.youtube.com/embed/1gDhl4leEzA' },
      { name: 'Flutter UI', link: 'https://www.youtube.com/embed/x0uigEPIWCE' },
      { name: 'Firebase integration', link: 'https://www.youtube.com/embed/EXp0gq9kGxI' },
    ]
  },
  {
    id: 'react-native', title: 'React Native', category: 'Mobile',
    description: 'បង្កើតកម្មវិធីទូរស័ព្ទដោយ React Native', icon: <i className="fa-brands fa-react" />,
    lessons: [
      { name: 'React Native Crash Course', link: 'https://www.youtube.com/embed/0-S5a0eXPoc' },
    ]
  },
  {
    id: 'game-dev', title: 'Game Development', category: 'Game',
    description: 'Pygame, Unity, Web Games', icon: <i className="fa-solid fa-gamepad" />,
    lessons: [
      { name: 'Pygame Basics', link: 'https://www.youtube.com/embed/FfWpgLFMI7w' },
      { name: 'Unity Intro', link: 'https://www.youtube.com/embed/gB1F9G0JXOo' },
      { name: 'Unreal Engine 5', link: 'https://www.youtube.com/embed/gQjMAhCCscM' },
    ]
  },
  {
    id: 'ui-ux', title: 'UI/UX Design (Figma)', category: 'Design',
    description: 'រចនា UI/UX ជាមួយកម្មវិធី Figma', icon: <i className="fa-brands fa-figma" />,
    lessons: [
      { name: 'Figma Full Course', link: 'https://www.youtube.com/embed/jwCmIBJ8Jtc' },
      { name: 'UX Principles', link: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
    ]
  },
  {
    id: 'ai-ml', title: 'AI & Machine Learning', category: 'Data',
    description: 'យល់ដឹងពី AI និង ML (Python)', icon: <i className="fa-solid fa-robot" />,
    lessons: [
      { name: 'Machine Learning Basics', link: 'https://www.youtube.com/embed/GwIoAwOUzIU' },
      { name: 'Deep Learning', link: 'https://www.youtube.com/embed/vyWAvY2CF9c' },
    ]
  },
  {
    id: 'git-github', title: 'Git & GitHub', category: 'Tools',
    description: 'របៀបប្រើ Git គ្រប់គ្រង Code', icon: <i className="fa-brands fa-github" />,
    lessons: [
      { name: 'Git Crash Course', link: 'https://www.youtube.com/embed/8JJ101D3knE' },
    ]
  },
  {
    id: 'docker', title: 'Docker Basics', category: 'Tools',
    description: 'រៀនប្រើ Docker សម្រាប់ Deploy', icon: <i className="fa-brands fa-docker" />,
    lessons: [
      { name: 'Docker Tutorial', link: 'https://www.youtube.com/embed/pTFZFxd4hOI' },
    ]
  }
];

const CATEGORIES = ['all', 'Web Development', 'Programming', 'Mobile', 'Game', 'Design', 'Data', 'Tools'];

function embedUrl(link: string) {
  if (!link) return '';
  return link.replace('watch?v=', 'embed/');
}

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
  const [learningSeconds, setLearningSeconds] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('completedLessons') || '[]'); } catch { return []; }
  });
  const [passedExams, setPassedExams] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('passedExams') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState<'courses' | 'favorites' | 'profile' | 'certificates' | 'exams'>('courses');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { getSeconds } = useLearningTimer(currentUser?.uid, currentUser?.displayName || undefined);

  useEffect(() => {
    const id = setInterval(() => setLearningSeconds(getSeconds()), 1000);
    return () => clearInterval(id);
  }, [getSeconds]);

  // Sync coursesCompleted to LeaderboardWeekly
  useEffect(() => {
    if (currentUser?.uid) {
      import('firebase/firestore').then(({ doc, setDoc }) => {
        const weekId = getWeekId();
        setDoc(doc(db, `leaderboard_${weekId}`, currentUser.uid), {
          uid: currentUser.uid,
          coursesCompleted: passedExams.length,
          displayName: currentUser.displayName || 'Anonymous'
        }, { merge: true }).catch(console.error);
      });
    }
  }, [passedExams.length, currentUser?.uid, currentUser?.displayName]);

  // Handle Real Notification from Firebase
  useEffect(() => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10));
      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          setNotifications(snap.docs.map(d => ({
            id: d.id,
            text: d.data().text || 'សារថ្មី',
            time: d.data().createdAt ? new Date(d.data().createdAt.toMillis()).toLocaleString() : 'ថ្មីៗនេះ',
            read: false // Simple read state
          })));
        }
      });
      return unsub;
    } catch {
      setNotifications([]);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const saveFavorites = (favs: Favorite[]) => {
    setFavorites(favs);
    localStorage.setItem('favorites', JSON.stringify(favs));
  };
  const addFav = (f: Favorite) => { if (!favorites.find((x) => x.name === f.name)) saveFavorites([...favorites, f]); };
  const removeFav = (f: Favorite) => saveFavorites(favorites.filter((x) => x.name !== f.name));
  const isFav = (f: Favorite) => !!favorites.find((x) => x.name === f.name);

  const markLessonDone = (courseId: string, lessonIndex: number) => {
    const lessonId = `${courseId}-${lessonIndex}`;
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem('completedLessons', JSON.stringify(updated));
    }
  };

  const isCourseDone = (course: Course) => {
    return course.lessons.every((_, i) => completedLessons.includes(`${course.id}-${i}`));
  };

  const handlePassExam = (courseId: string) => {
    if (!passedExams.includes(courseId)) {
      const updated = [...passedExams, courseId];
      setPassedExams(updated);
      localStorage.setItem('passedExams', JSON.stringify(updated));
      alert('🎉 អបអរសាទរ! អ្នកបានប្រឡងជាប់។ វិញ្ញាបនបត្ររបស់អ្នកត្រូវបានបង្កើត។');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredCourses = defaultCourses.filter((c) => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lessons.some((l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  const displayName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif', position: 'relative' }}>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar" style={{
        width: sidebarOpen ? 260 : 0, minWidth: sidebarOpen ? 260 : 0,
        background: 'linear-gradient(180deg,#1e293b,#0f172a)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', overflow: 'hidden',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        top: 0, left: 0, height: '100%', zIndex: 110, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 16px', flexGrow: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <img src="/assets/img/images/logo.png" alt="Rotana Education" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }} />
            <span style={{ fontWeight: 'bold', fontSize: 17, color: '#f8fafc' }}>Rotana Education</span>
          </div>

          <div style={{ background: 'rgba(37,99,235,0.15)', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#94a3b8' }}><i className="fa-solid fa-user-circle" /> {displayName}</div>
            <div style={{ fontSize: 12, color: '#06D6A0', marginTop: 4 }}>
              <i className="fa-solid fa-hourglass-half" /> {formatKhmer(learningSeconds)}
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 8, fontWeight: 700 }}>Menu หลัก</div>
          {[
            { id: 'courses', icon: <i className="fa-solid fa-book-open" />, label: 'ថ្នាក់រៀន (Classes)' },
            { id: 'favorites', icon: <i className="fa-solid fa-star" style={{ color: '#fbbf24' }} />, label: 'ចំណូលចិត្ត (Favorites)' },
            { id: 'certificates', icon: <i className="fa-solid fa-certificate" style={{ color: '#06D6A0' }} />, label: 'វិញ្ញាបនបត្រ (Certificates)' },
            { id: 'exams', icon: <i className="fa-solid fa-clipboard-question" style={{ color: '#f43f5e' }} />, label: 'ការប្រឡង & Quiz' },
            { id: 'profile', icon: <i className="fa-solid fa-user-gear" />, label: 'ការកំណត់ Profile' },
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); if (window.innerWidth <= 768) setSidebarOpen(false); }}
              style={{ width: '100%', padding: '10px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, background: activeTab === item.id ? 'rgba(37,99,235,0.25)' : 'transparent', border: 'none', borderRadius: 10, color: activeTab === item.id ? '#60a5fa' : '#f8fafc', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === item.id ? 600 : 400 }}>
              {item.icon} {item.label}
            </button>
          ))}

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, marginTop: 20, paddingLeft: 8, fontWeight: 700 }}>Features</div>
          
          <Link to="/leaderboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#fbbf24', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            <i className="fa-solid fa-trophy" /> Leaderboard (អ្នកពូកែ)
          </Link>
          <Link to="/community" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#38bdf8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            <i className="fa-solid fa-users" /> សហគមន៍ (Community)
          </Link>
          <Link to="/chatbot" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#a5b4fc', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            <i className="fa-solid fa-robot" /> AI Tutor (Chatbot)
          </Link>
          <Link to="/welcome" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#94a3b8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            <i className="fa-solid fa-house" /> ទំព័រស្វាគមន៍ (Welcome)
          </Link>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, marginTop: 20, paddingLeft: 8, fontWeight: 700 }}>Social Media</div>
          <div style={{ display: 'flex', gap: 10, padding: '0 10px' }}>
            <a href="#" style={{ color: '#3b5998', fontSize: 20 }}><i className="fa-brands fa-facebook" /></a>
            <a href="#" style={{ color: '#FF0000', fontSize: 20 }}><i className="fa-brands fa-youtube" /></a>
            <a href="#" style={{ color: '#0088cc', fontSize: 20 }}><i className="fa-brands fa-telegram" /></a>
            <a href="#" style={{ color: '#E1306C', fontSize: 20 }}><i className="fa-brands fa-instagram" /></a>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i className="fa-solid fa-right-from-bracket" /> ចាកចេញ
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20, padding: '4px 8px' }}>
            <i className="fa-solid fa-bars" />
          </button>
          
          <span style={{ fontWeight: 'bold', fontSize: 18, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-chalkboard-user" style={{ color: '#2563eb' }} />
            Dashboard
          </span>

          <div style={{ position: 'relative', maxWidth: 320, width: '100%', display: window.innerWidth > 600 ? 'block' : 'none' }}>
            <input
              type="text"
              placeholder="ស្វែងរកមេរៀន..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.3s' }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 14 }} />
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#f8fafc', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <i className="fa-solid fa-bell" style={{ fontSize: 18 }} />
              {unreadCount > 0 && (
                <span className="notif-count" style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10, border: '2px solid #0f1724' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: 50, right: 0, width: 320, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 15, color: '#f8fafc' }}>ការជូនដំណឹង (Notifications)</h4>
                  <button onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: 12 }}>Mark all read</button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', background: n.read ? 'transparent' : 'rgba(37,99,235,0.1)', cursor: 'pointer', display: 'flex', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : '#3b82f6', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, color: n.read ? '#cbd5e1' : '#f8fafc', marginBottom: 4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}><i className="fa-regular fa-clock" /> {n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>

          {/* ===== TAB: COURSES ===== */}
          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              {/* Category Filter */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{ padding: '8px 20px', borderRadius: 24, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeCategory === cat ? 'linear-gradient(135deg,#2563eb,#06D6A0)' : 'rgba(255,255,255,0.05)', color: activeCategory === cat ? 'white' : '#94a3b8', transition: 'all 0.2s', boxShadow: activeCategory === cat ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>
                    {cat === 'all' ? 'ទាំងអស់' : cat}
                  </button>
                ))}
              </div>

              {/* Courses Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {filteredCourses.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }} /><br/>
                    មិនមានវគ្គសម្រាប់ "<strong>{searchTerm || activeCategory}</strong>" ទេ
                  </div>
                ) : filteredCourses.map((course) => {
                  const lessonsDone = course.lessons.filter((_, i) => completedLessons.includes(`${course.id}-${i}`)).length;
                  const done = lessonsDone === course.lessons.length;
                  const progress = course.lessons.length > 0 ? Math.floor((lessonsDone / course.lessons.length) * 100) : 0;
                  
                  return (
                    <div key={course.id} style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,99,235,0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                          {course.icon}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <h3 style={{ color: '#f8fafc', margin: '0 0 4px', fontSize: 17 }}>{course.title}</h3>
                          <p style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>{course.description}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>
                          <span><i className="fa-solid fa-chart-line" /> វឌ្ឍនភាព</span><span style={{ color: done ? '#10b981' : '#60a5fa' }}>{done ? 100 : progress}%</span>
                        </div>
                        <div style={{ background: '#334155', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${done ? 100 : progress}%`, height: '100%', background: done ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius: 10, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>

                      {/* Accordion lessons */}
                      <div style={{ marginTop: 'auto' }}>
                        <button onClick={(e) => {
                          const panel = e.currentTarget.nextElementSibling as HTMLElement;
                          panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                        }} style={{ background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 14, fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span><i className="fa-solid fa-list" style={{ marginRight: 8, color: '#94a3b8' }} /> មេរៀន ({course.lessons.length})</span>
                          <i className="fa-solid fa-chevron-down" style={{ fontSize: 12 }} />
                        </button>
                        <div style={{ display: 'none', padding: '12px 0 0', marginTop: 8 }}>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {course.lessons.map((lesson, li) => {
                              const fav = isFav({ name: lesson.name, link: lesson.link });
                              const lessonDone = completedLessons.includes(`${course.id}-${li}`);
                              return (
                                <li key={li} style={{ padding: '10px 12px', background: 'rgba(15,23,42,0.5)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                                  <span style={{ flexGrow: 1, fontSize: 13, color: lessonDone ? '#10b981' : '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: lessonDone ? 'line-through' : 'none' }}>
                                    <i className={lessonDone ? "fa-solid fa-circle-check" : "fa-solid fa-play"} style={{ fontSize: 10, marginRight: 8, color: lessonDone ? '#10b981' : '#3b82f6' }} /> {lesson.name}
                                  </span>
                                  {!lessonDone && (
                                    <button onClick={() => { setVideoSrc(embedUrl(lesson.link)); markLessonDone(course.id, li); }}
                                      style={{ padding: '6px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                                      រៀនឥឡូវនេះ
                                    </button>
                                  )}
                                  <button onClick={() => fav ? removeFav({ name: lesson.name, link: lesson.link }) : addFav({ name: lesson.name, link: lesson.link })}
                                    style={{ padding: '6px 10px', background: fav ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)', color: fav ? '#ef4444' : '#94a3b8', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                    <i className="fa-solid fa-star" />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          {done && (
                            <div style={{ marginTop: 12, width: '100%', padding: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>
                              <i className="fa-solid fa-circle-check" /> អ្នកបានរៀនចប់គ្រប់មេរៀន!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== TAB: FAVORITES ===== */}
          {activeTab === 'favorites' && (
            <div className="animate-fadeIn">
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa-solid fa-star" style={{ color: '#fbbf24' }} /> មេរៀនដែលចូលចិត្ត
              </h2>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                  <i className="fa-solid fa-star" style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }} /><br/>
                  មិនទាន់មានមេរៀនដែលចូលចិត្ត<br />
                  <span style={{ fontSize: 14 }}>ចុចប៊ូតុង ផ្កាយ នៅក្នុងវគ្គ ដើម្បីរក្សាទុក</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {favorites.map((fav, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-play" />
                      </div>
                      <span style={{ flexGrow: 1, fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{fav.name}</span>
                      <button onClick={() => setVideoSrc(embedUrl(fav.link))} style={{ width: 36, height: 36, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><i className="fa-solid fa-play" /></button>
                      <button onClick={() => removeFav(fav)} style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer' }}><i className="fa-solid fa-trash" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== TAB: CERTIFICATES ===== */}
          {activeTab === 'certificates' && (
            <div className="animate-fadeIn">
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa-solid fa-certificate" style={{ color: '#06D6A0' }} /> វិញ្ញាបនបត្ររបស់អ្នក
              </h2>
              {passedExams.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                  <i className="fa-solid fa-lock" style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }} /><br/>
                  អ្នកមិនទាន់មានវិញ្ញាបនបត្រនៅឡើយទេ<br />
                  <span style={{ fontSize: 14 }}>សូមបញ្ចប់វគ្គសិក្សា និងប្រឡងជាប់ដើម្បីទទួលបាន Certificate</span>
                  <br/>
                  <button onClick={() => setActiveTab('courses')} className="btn btn-primary" style={{ marginTop: 20 }}>
                    <i className="fa-solid fa-book-open" /> ទៅរៀនឥឡូវនេះ
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                  {passedExams.map(id => {
                    const course = defaultCourses.find(c => c.id === id);
                    if (!course) return null;
                    return (
                      <div key={id} style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '2px solid #06D6A0', borderRadius: 16, padding: 30, textAlign: 'center', boxShadow: '0 8px 30px rgba(6,214,160,0.2)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: 120 }}><i className="fa-solid fa-award" /></div>
                        <i className="fa-solid fa-award" style={{ fontSize: 50, color: '#06D6A0', marginBottom: 16 }} />
                        <h3 style={{ fontSize: 20, color: '#f8fafc', marginBottom: 8, fontFamily: '"Dongrek", sans-serif' }}>វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា</h3>
                        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>បានបញ្ជាក់ថា</p>
                        <h4 style={{ fontSize: 22, color: '#60a5fa', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>{displayName}</h4>
                        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>បានបញ្ចប់វគ្គសិក្សាដោយជោគជ័យ៖</p>
                        <h5 style={{ fontSize: 18, color: '#f8fafc', margin: 0 }}>{course.title}</h5>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== TAB: EXAMS ===== */}
          {activeTab === 'exams' && (
            <div className="animate-fadeIn">
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa-solid fa-clipboard-question" style={{ color: '#f43f5e' }} /> ការប្រឡង និង Quiz
              </h2>
              {defaultCourses.filter(isCourseDone).length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                  <i className="fa-solid fa-file-circle-xmark" style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }} /><br/>
                  អ្នកមិនទាន់បានរៀនចប់វគ្គណាមួយនៅឡើយទេ<br />
                  <span style={{ fontSize: 14 }}>រៀនចប់វគ្គណាមួយ នោះការប្រឡងនឹងបើកដោយស្វ័យប្រវត្តិ!</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                  {defaultCourses.filter(isCourseDone).map((course, i) => {
                    const passed = passedExams.includes(course.id);
                    return (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: passed ? '1px solid #10b981' : '1px solid #f43f5e', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                        <i className={passed ? "fa-solid fa-circle-check" : "fa-solid fa-file-pen"} style={{ fontSize: 40, color: passed ? '#10b981' : '#f43f5e', marginBottom: 16 }} />
                        <h3 style={{ fontSize: 18, marginBottom: 8, color: '#f8fafc' }}>{course.title} Quiz</h3>
                        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>សំណួរខ្លីៗដើម្បីទទួលបានវិញ្ញាបនបត្រ</p>
                        {passed ? (
                          <div style={{ color: '#10b981', fontWeight: 600 }}><i className="fa-solid fa-check" /> អ្នកបានប្រឡងជាប់ហើយ!</div>
                        ) : (
                          <button onClick={() => {
                            if (window.confirm(`តើអ្នកពិតជាចង់ប្រឡងវគ្គ ${course.title} ឥឡូវនេះឬទេ?`)) {
                              handlePassExam(course.id);
                            }
                          }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <i className="fa-solid fa-play" /> ចាប់ផ្ដើមប្រឡង
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== TAB: PROFILE ===== */}
          {activeTab === 'profile' && (
            <div className="animate-fadeIn" style={{ maxWidth: 600 }}>
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa-solid fa-user-gear" /> ព័ត៌មានគណនី
              </h2>
              <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))', borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 'bold' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 24, margin: '0 0 6px', color: '#f8fafc' }}>{displayName}</h3>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}><i className="fa-solid fa-envelope" style={{ marginRight: 6 }}/> {currentUser?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>ពេលវេលារៀនសរុប</div>
                    <div style={{ color: '#06D6A0', fontSize: 24, fontWeight: 'bold' }}><i className="fa-solid fa-clock" /> {formatKhmer(learningSeconds)}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>មេរៀនបានបញ្ចប់</div>
                    <div style={{ color: '#3b82f6', fontSize: 24, fontWeight: 'bold' }}><i className="fa-solid fa-graduation-cap" /> {completedLessons.length}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to="/profile-sitting" className="btn btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }}>
                    <i className="fa-solid fa-pen-to-square" /> កែប្រែប្រវត្តិរូប
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger" style={{ flexGrow: 1, justifyContent: 'center' }}>
                    <i className="fa-solid fa-right-from-bracket" /> ចាកចេញ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {videoSrc && <VideoModal src={videoSrc} onClose={() => setVideoSrc(null)} />}
    </div>
  );
}
