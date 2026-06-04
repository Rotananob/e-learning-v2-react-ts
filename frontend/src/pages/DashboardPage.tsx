import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoModal from '../components/common/VideoModal';
import { formatKhmer, useLearningTimer } from '../hooks/useLearningTimer';
import type { Favorite, Course } from '../types';

// ======= DEFAULT COURSES DATA (from original dashboard.html) =======
const defaultCourses: Course[] = [
  {
    id: 'web-basic', title: 'Web Basic (HTML/CSS/JS)', category: 'Web Development',
    description: 'រៀន HTML, CSS, JavaScript ពីដំបូង', icon: '🌐',
    lessons: [
      { name: 'HTML Intro', link: 'https://www.youtube.com/embed/qz0aGYrrlhU' },
      { name: 'CSS Basics', link: 'https://www.youtube.com/embed/yfoY53QXEnI' },
      { name: 'JavaScript Basics', link: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
    ]
  },
  {
    id: 'python', title: 'Python Programming', category: 'Programming',
    description: 'Python ពីចាប់ផ្ដើមដល់ Advanced', icon: '🐍',
    lessons: [
      { name: 'Python Intro', link: 'https://www.youtube.com/embed/rfscVS0vtbw' },
      { name: 'Python OOP', link: 'https://www.youtube.com/embed/Ej_02ICOIgs' },
    ]
  },
  {
    id: 'react', title: 'React JS', category: 'Web Development',
    description: 'React.js + Hooks + TypeScript', icon: '⚛️',
    lessons: [
      { name: 'React Intro', link: 'https://www.youtube.com/embed/w7ejDZ8SWv8' },
      { name: 'React Hooks', link: 'https://www.youtube.com/embed/dpw9EHDh2bM' },
    ]
  },
  {
    id: 'game-dev', title: 'Game Development', category: 'Game',
    description: 'Pygame, Unity, Web Games', icon: '🎮',
    lessons: [
      { name: 'Pygame Basics', link: 'https://www.youtube.com/embed/FfWpgLFMI7w' },
    ]
  },
  {
    id: 'flutter', title: 'Flutter / Mobile Dev', category: 'Mobile',
    description: 'Flutter, Dart, Android App', icon: '📱',
    lessons: [
      { name: 'Flutter Intro', link: 'https://www.youtube.com/embed/1gDhl4leEzA' },
    ]
  },
];

const CATEGORIES = ['all', 'Web Development', 'Programming', 'Game', 'Mobile'];

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
  const [completedCourses, setCompletedCourses] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('completedCourses') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState<'courses' | 'favorites' | 'profile'>('courses');

  const { getSeconds } = useLearningTimer(currentUser?.displayName || undefined);

  // Update learning time display every second
  useEffect(() => {
    const id = setInterval(() => setLearningSeconds(getSeconds()), 1000);
    return () => clearInterval(id);
  }, [getSeconds]);

  // Save favorites
  const saveFavorites = (favs: Favorite[]) => {
    setFavorites(favs);
    localStorage.setItem('favorites', JSON.stringify(favs));
  };
  const addFav = (f: Favorite) => { if (!favorites.find((x) => x.name === f.name)) saveFavorites([...favorites, f]); };
  const removeFav = (f: Favorite) => saveFavorites(favorites.filter((x) => x.name !== f.name));
  const isFav = (f: Favorite) => !!favorites.find((x) => x.name === f.name);

  const toggleComplete = (id: string) => {
    const updated = completedCourses.includes(id)
      ? completedCourses.filter((c) => c !== id)
      : [...completedCourses, id];
    setCompletedCourses(updated);
    localStorage.setItem('completedCourses', JSON.stringify(updated));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filter courses
  const filteredCourses = defaultCourses.filter((c) => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lessons.some((l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  const displayName = currentUser?.displayName || currentUser?.email || 'Guest';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif', position: 'relative' }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: sidebarOpen ? 240 : 0, minWidth: sidebarOpen ? 240 : 0,
        background: 'linear-gradient(180deg,#1e293b,#0f172a)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', overflow: 'hidden',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        top: 0, left: 0, height: '100%', zIndex: 110, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 16px', flexGrow: 1, overflowY: 'auto' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <img src="/assets/img/images/logo.png" alt="Rotana" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rotana&background=2563eb&color=fff'; }} />
            <span style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc' }}>Rotana E-Learn</span>
          </div>

          {/* User Info */}
          <div style={{ background: 'rgba(37,99,235,0.15)', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>👤 {displayName}</div>
            <div style={{ fontSize: 12, color: '#06D6A0', marginTop: 4 }}>
              ⏳ {formatKhmer(learningSeconds)}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              ✅ {completedCourses.length} វគ្គបានរៀន
            </div>
          </div>

          {/* Nav */}
          {[
            { icon: '📚', label: 'វគ្គសិក្សា', tab: 'courses' as const },
            { icon: '⭐', label: 'ចំណូលចិត្ត', tab: 'favorites' as const },
            { icon: '👤', label: 'ព្រំដែន', tab: 'profile' as const },
          ].map((item) => (
            <button key={item.tab} onClick={() => { setActiveTab(item.tab); if (window.innerWidth <= 768) setSidebarOpen(false); }}
              style={{ width: '100%', padding: '10px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, background: activeTab === item.tab ? 'rgba(37,99,235,0.25)' : 'transparent', border: 'none', borderRadius: 10, color: '#f8fafc', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s' }}>
              {item.icon} {item.label}
            </button>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '12px 0' }} />

          <Link to="/chatbot" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#a5b4fc', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            🤖 AI Tutor (Chatbot)
          </Link>
          <Link to="/profile-sitting" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#94a3b8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            ⚙️ ការកំណត់ Profile
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#94a3b8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 6 }}>
            🏠 ទំព័រដើម
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            🚪 ចាកចេញ
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20, padding: '4px 8px' }}>
            <i className="fa fa-bars" />
          </button>
          <span style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc', flexGrow: 1 }}>
            📊 Dashboard — ថ្នាក់រៀន
          </span>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 300, width: '100%' }}>
            <input
              type="text"
              placeholder="🔍 ស្វែងរកមេរៀន..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 14px 8px 36px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: '#f8fafc', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            />
            <i className="fa fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }} />
          </div>

          <Link to="/chatbot" style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            🤖 AI Tutor
          </Link>
        </nav>

        {/* Content Area */}
        <div style={{ flexGrow: 1, padding: '24px 20px', overflowY: 'auto' }}>

          {/* ===== TAB: COURSES ===== */}
          {activeTab === 'courses' && (
            <>
              {/* Category Filter */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{ padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeCategory === cat ? 'linear-gradient(135deg,#2563eb,#06D6A0)' : 'rgba(255,255,255,0.07)', color: activeCategory === cat ? 'white' : '#94a3b8', transition: 'all 0.2s' }}>
                    {cat === 'all' ? 'ទាំងអស់' : cat}
                  </button>
                ))}
              </div>

              {/* Courses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {filteredCourses.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18 }}>
                    🚫 មិនមានវគ្គសម្រាប់ "<strong>{searchTerm || activeCategory}</strong>" ទេ
                  </div>
                ) : filteredCourses.map((course) => {
                  const done = completedCourses.includes(course.id);
                  const progress = done ? 100 : Math.floor(Math.random() * 50 + 10);
                  return (
                    <div key={course.id} style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))', borderRadius: 14, padding: 22, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <h3 style={{ color: '#60a5fa', margin: '0 0 6px', fontSize: 18 }}>
                            {course.icon} {course.title}
                          </h3>
                          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>{course.description}</p>
                        </div>
                        <button onClick={() => toggleComplete(course.id)}
                          style={{ padding: '8px 18px', background: done ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
                          {done ? '✅ បានរៀនហើយ' : '📌 ចុចថារៀនហើយ'}
                        </button>
                      </div>

                      {/* Progress */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                          <span>វឌ្ឍនភាព</span><span>{done ? 100 : progress}%</span>
                        </div>
                        <div style={{ background: '#374151', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${done ? 100 : progress}%`, height: '100%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 10, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>

                      {/* Accordion lessons */}
                      <button onClick={(e) => {
                        const panel = e.currentTarget.nextElementSibling as HTMLElement;
                        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                      }} style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', padding: '10px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 14, fontFamily: 'inherit', transition: 'all 0.3s' }}>
                        📖 មេរៀន ({course.lessons.length})
                      </button>
                      <div style={{ display: 'none', padding: '12px 0 0', background: 'rgba(0,0,0,0.15)', borderRadius: '0 0 8px 8px', marginTop: -2 }}>
                        <ul style={{ listStyle: 'none', padding: '0 10px', margin: 0 }}>
                          {course.lessons.map((lesson, li) => {
                            const fav = isFav({ name: lesson.name, link: lesson.link });
                            return (
                              <li key={li} style={{ padding: '10px 8px', background: 'rgba(255,255,255,0.04)', marginBottom: 8, borderRadius: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ flexGrow: 1, fontSize: 14, color: '#e2e8f0' }}>▶ {lesson.name}</span>
                                <button onClick={() => setVideoSrc(embedUrl(lesson.link))}
                                  style={{ padding: '5px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                                  ▶️ ចូលរៀន
                                </button>
                                <button onClick={() => fav ? removeFav({ name: lesson.name, link: lesson.link }) : addFav({ name: lesson.name, link: lesson.link })}
                                  style={{ padding: '5px 10px', background: fav ? '#ef4444' : '#374151', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                                  {fav ? '❌' : '⭐'}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ===== TAB: FAVORITES ===== */}
          {activeTab === 'favorites' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 20, fontSize: 22 }}>⭐ មេរៀនដែលចូលចិត្ត</h2>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18 }}>
                  ⭐ មិនទាន់មានមេរៀនដែលចូលចិត្ត<br />
                  <span style={{ fontSize: 14 }}>ចុចប៊ូតុង ⭐ នៅក្នុងវគ្គ ដើម្បីរក្សាទុក</span>
                </div>
              ) : favorites.map((fav, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ flexGrow: 1, fontSize: 14 }}>⭐ {fav.name}</span>
                  <button onClick={() => setVideoSrc(embedUrl(fav.link))}
                    style={{ padding: '6px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>▶️ ចូលរៀន</button>
                  <button onClick={() => removeFav(fav)}
                    style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>❌</button>
                </div>
              ))}
            </div>
          )}

          {/* ===== TAB: PROFILE ===== */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ color: '#f8fafc', marginBottom: 20 }}>👤 ព័ត៌មានគណនី</h2>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>ឈ្មោះ</div>
                  <div style={{ color: '#f8fafc', fontSize: 16 }}>{currentUser?.displayName || '—'}</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Email</div>
                  <div style={{ color: '#f8fafc', fontSize: 16 }}>{currentUser?.email}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>ពេលវេលារៀន (ប្រចាំសប្ដាហ៍)</div>
                  <div style={{ color: '#06D6A0', fontSize: 22, fontWeight: 'bold' }}>{formatKhmer(learningSeconds)}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link to="/profile-sitting" className="btn btn-primary" style={{ fontSize: 14 }}>
                    <i className="fa fa-user-gear" /> ការកំណត់ Profile
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: 14 }}>
                    <i className="fa fa-sign-out-alt" /> ចាកចេញ
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
