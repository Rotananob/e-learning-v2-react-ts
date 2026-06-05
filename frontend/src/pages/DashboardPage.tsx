import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoModal from '../components/common/VideoModal';
import { formatKhmer, useLearningTimer } from '../hooks/useLearningTimer';
import type { Favorite, Course } from '../types';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getWeekId } from '../hooks/useLearningTimer';

import { ALL_COURSES as defaultCourses, CATEGORIES, QUIZ_QUESTIONS as quizQuestions } from '../data/coursesData';
import { subscribeUserData, saveFavorites as apiSaveFavorites, saveCompletedLessons as apiSaveCompletedLessons, savePassedExams as apiSavePassedExams, saveProfile as apiSaveProfile, appendHistory } from '../services/userDataService';

// ======= ENHANCED PROFILE INTERFACE =======
interface UserProfile {
  bio: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
  joinDate: string;
  
  // Education
  school: string;
  degree: string;
  graduationYear: string;
  field: string;
  
  // Experience
  jobTitle: string;
  company: string;
  yearsExp: string;
  
  // Skills
  skills: string[];
  languages: string[];
  
  // Preferences
  theme: 'dark' | 'light';
  language: 'km' | 'en';
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'private' | 'friends';
  showActivity: boolean;
  allowMessages: boolean;
  dataTracking: boolean;
}

function embedUrl(link: string) {
  if (!link) return '';
  return link.replace('watch?v=', 'embed/');
}

export default function DashboardPageAdvanced() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main states
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'favorites' | 'profile' | 'certificates' | 'exams' | 'stats' | 'settings' | 'activity'>('courses');
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileTab, setProfileTab] = useState<'overview' | 'education' | 'experience' | 'skills' | 'preferences' | 'privacy'>('overview');

  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Profile states
  const [editingProfile, setEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: '', phone: '', location: '', website: '', github: '', linkedin: '', twitter: '',
    profileImage: 'https://ui-avatars.com/api/?name=' + (currentUser?.displayName || 'User'),
    joinDate: new Date().toLocaleDateString('km-KH'),
    school: '', degree: '', graduationYear: '', field: '',
    jobTitle: '', company: '', yearsExp: '',
    skills: [], languages: [],
    theme: 'dark', language: 'km', emailNotifications: true, pushNotifications: true,
    profileVisibility: 'public', showActivity: true, allowMessages: true, dataTracking: true,
  });

  // Learning data states
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [passedExams, setPassedExams] = useState<string[]>([]);
  
  // Real-time data sync with Firebase
  useEffect(() => {
    if (currentUser?.uid) {
      const unsub = subscribeUserData(currentUser.uid, (data) => {
        setFavorites(data.favorites as unknown as Favorite[]);
        setCompletedLessons(data.completedLessons);
        setPassedExams(data.passedExams);
        if (data.profile && Object.keys(data.profile).length > 0) {
          setUserProfile(prev => ({ ...prev, ...data.profile }));
        }
      });
      return () => unsub();
    }
  }, [currentUser?.uid]);
  const [learningSeconds, setLearningSeconds] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { getSeconds } = useLearningTimer(currentUser?.uid, currentUser?.displayName || undefined);

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

  // Learning timer effect
  useEffect(() => {
    const id = setInterval(() => setLearningSeconds(getSeconds()), 1000);
    return () => clearInterval(id);
  }, [getSeconds]);

  // Firebase notifications
  useEffect(() => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10));
      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          setNotifications(snap.docs.map(d => ({
            id: d.id,
            text: d.data().text || 'សារថ្មី',
            time: d.data().createdAt ? new Date(d.data().createdAt.toMillis()).toLocaleString() : 'ថ្មីៗនេះ',
            read: false
          })));
        }
      });
      return unsub;
    } catch {
      setNotifications([]);
    }
  }, []);

  // Helper functions
  // Helper functions
  const updateFavorites = (favs: Favorite[]) => {
    setFavorites(favs);
    if (currentUser?.uid) apiSaveFavorites(currentUser.uid, favs as any);
  };

  const removeFav = (f: Favorite) => updateFavorites(favorites.filter((x) => x.name !== f.name));

  const markLessonDone = (courseId: string, lessonIndex: number) => {
    const lessonId = `${courseId}-${lessonIndex}`;
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      if (currentUser?.uid) apiSaveCompletedLessons(currentUser.uid, updated);
      
      // Also record history
      const course = defaultCourses.find(c => c.id === courseId);
      const lesson = course?.lessons[lessonIndex];
      if (currentUser?.uid && course && lesson) {
        appendHistory(currentUser.uid, [], {
          lessonId,
          lessonName: lesson.name,
          courseId,
          courseTitle: course.title,
          timestamp: Date.now()
        });
      }
    }
  };

  const isCourseDone = (course: Course) => {
    return course.lessons.every((_, i) => completedLessons.includes(`${course.id}-${i}`));
  };

  const handlePassExam = (courseId: string) => {
    if (!passedExams.includes(courseId)) {
      const updated = [...passedExams, courseId];
      setPassedExams(updated);
      if (currentUser?.uid) apiSavePassedExams(currentUser.uid, updated);
      alert('🎉 អបអរសាទរ! អ្នកបានប្រឡងជាប់។ វិញ្ញាបនបត្ររបស់អ្នកត្រូវបានបង្កើត។');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfile = { ...userProfile, profileImage: reader.result as string };
        setUserProfile(newProfile);
        if (currentUser?.uid) apiSaveProfile(currentUser.uid, newProfile);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    if (currentUser?.uid) apiSaveProfile(currentUser.uid, userProfile);
    setEditingProfile(false);
    alert('ព័ត៌មានគណនីបានរក្សាទុកដោយជោគជ័យ!');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredCourses = defaultCourses.filter((c) => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const displayName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif' }}>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: sidebarOpen ? 280 : 0, minWidth: sidebarOpen ? 280 : 0,
        background: 'linear-gradient(180deg,#1e293b,#0f172a)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', overflow: 'hidden',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        top: 0, left: 0, height: '100%', zIndex: 110, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 16px', flexGrow: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <img src="/assets/img/images/logo.png" alt="Rotana Logo" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc' }}>Rotana</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Education</div>
            </div>
          </div>

          <div style={{ background: 'rgba(37,99,235,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-solid fa-user-circle" /> {displayName}
              {learningSeconds >= 300 && <i className="fa-solid fa-circle-check" style={{ color: '#3b82f6', fontSize: 14 }} title="Verified Learner" />}
            </div>
            <div style={{ fontSize: 12, color: '#06D6A0', marginBottom: 4 }}>
              <i className="fa-solid fa-hourglass-half" /> {formatKhmer(learningSeconds)}
            </div>
            <div style={{ fontSize: 12, color: '#38bdf8' }}>
              <i className="fa-solid fa-book" /> {completedLessons.length} មេរៀន
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 8, fontWeight: 700 }}>Menu</div>
          {[
            { id: 'courses', icon: 'fa-book-open', label: 'វគ្គសិក្សា' },
            { id: 'stats', icon: 'fa-chart-bar', label: 'ស្ថិតិ' },
            { id: 'exams', icon: 'fa-clipboard-question', label: 'ការប្រឡង' },
            { id: 'favorites', icon: 'fa-star', label: 'ចំណូលចិត្ត' },
            { id: 'certificates', icon: 'fa-certificate', label: 'វិញ្ញាបនបត្រ' },
            { id: 'activity', icon: 'fa-history', label: 'សកម្មភាព' },
            { id: 'profile', icon: 'fa-user-gear', label: 'ប្រវត្តិរូប' },
            { id: 'settings', icon: 'fa-cog', label: 'ការកំណត់' },
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id as any); if (window.innerWidth <= 768) setSidebarOpen(false); }}
              style={{
                width: '100%', padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
                background: activeTab === item.id ? 'rgba(37,99,235,0.3)' : 'transparent', border: 'none', borderRadius: 10,
                color: activeTab === item.id ? '#60a5fa' : '#cbd5e1', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                textAlign: 'left', transition: 'all 0.2s', fontWeight: activeTab === item.id ? 600 : 400
              }}>
              <i className={`fa-solid ${item.icon}`} /> {item.label}
            </button>
          ))}

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 12, marginTop: 24, paddingLeft: 8, fontWeight: 700 }}>Features</div>
          <Link to="/leaderboard" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', color: '#fbbf24', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 8 }}>
            <i className="fa-solid fa-trophy" /> ឈានលើគេ
          </Link>
          <Link to="/community" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', color: '#38bdf8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 8 }}>
            <i className="fa-solid fa-users" /> សហគមន៍
          </Link>
          <Link to="/chatbot" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', color: '#a855f7', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 24 }}>
            <i className="fa-solid fa-robot" /> AI Chatbot
          </Link>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 8, fontWeight: 700 }}>ផ្សេងៗ</div>
          <Link to="/about-us" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', color: '#94a3b8', textDecoration: 'none', borderRadius: 10, fontSize: 14, marginBottom: 8 }}>
            <i className="fa-solid fa-circle-info" /> អំពីពួកយើង (About Us)
          </Link>
          <Link to="/privacy-policy" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', color: '#94a3b8', textDecoration: 'none', borderRadius: 10, fontSize: 14 }}>
            <i className="fa-solid fa-shield-halved" /> ឯកជនភាព និងរបៀបប្រើ
          </Link>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, marginTop: 20, paddingLeft: 8, fontWeight: 700 }}>Social Media</div>
          <div style={{ display: 'flex', gap: 10, padding: '0 10px' }}>
            <a href="#" style={{ color: '#3b5998', fontSize: 20 }}><i className="fa-brands fa-facebook" /></a>
            <a href="#" style={{ color: '#FF0000', fontSize: 20 }}><i className="fa-brands fa-youtube" /></a>
            <a href="#" style={{ color: '#0088cc', fontSize: 20 }}><i className="fa-brands fa-telegram" /></a>
            <a href="#" style={{ color: '#E1306C', fontSize: 20 }}><i className="fa-brands fa-instagram" /></a>
          </div>
        </div>

        <div style={{ padding: '16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i className="fa-solid fa-right-from-bracket" /> ចាកចេញ
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 28px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20 }}>
            <i className="fa-solid fa-bars" />
          </button>
          
          <span style={{ fontWeight: 'bold', fontSize: 18, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-chalkboard-user" style={{ color: '#2563eb' }} />
            Dashboard Pro
          </span>

          <div className="search-container" style={{ position: 'relative', flexGrow: 1, maxWidth: 340, marginLeft: 'auto', marginRight: 16 }}>
            <input
              type="text"
              placeholder="ស្វែងរកមេរៀន និងវគ្គសិក្សា..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.3s' }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 14 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <img 
                src={userProfile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff`} 
                alt="Profile" 
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                title="ចុចដើម្បីប្ដូររូបភាព Profile"
              />
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
            </label>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#f8fafc', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-bell" style={{ fontSize: 18 }} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10 }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: 50, right: 0, width: 340, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, maxHeight: 400, overflowY: 'auto' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ margin: 0, fontSize: 15, color: '#f8fafc' }}>ការជូនដំណឹង</h4>
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>មិនទាន់មាន</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 13, color: '#cbd5e1' }}>
                        <div style={{ marginBottom: 4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div style={{ flexGrow: 1, padding: '28px', overflowY: 'auto' }}>

          {/* ===== COURSES TAB ===== */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '8px 20px', borderRadius: 24, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: activeCategory === cat ? 'linear-gradient(135deg,#2563eb,#06D6A0)' : 'rgba(255,255,255,0.05)',
                      color: activeCategory === cat ? 'white' : '#94a3b8', transition: 'all 0.2s'
                    }}>
                    {cat === 'all' ? 'ទាំងអស់' : cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {filteredCourses.map((course) => {
                  const lessonsDone = course.lessons.filter((_, i) => completedLessons.includes(`${course.id}-${i}`)).length;
                  const done = lessonsDone === course.lessons.length;
                  const progress = course.lessons.length > 0 ? Math.floor((lessonsDone / course.lessons.length) * 100) : 0;
                  
                  return (
                    <div key={course.id} style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(37,99,235,0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                          {typeof course.icon === 'string' ? <i className={course.icon} /> : course.icon}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <h3 style={{ color: '#f8fafc', margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>{course.title}</h3>
                          <p style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>{course.description}</p>
                        </div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                          <span><i className="fa-solid fa-chart-line" style={{ marginRight: 6 }} />វឌ្ឍនភាព</span>
                          <span style={{ color: done ? '#10b981' : '#60a5fa', fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div style={{ background: '#334155', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${progress}%`, height: '100%', background: done ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#3b82f6,#60a5fa)', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>

                      <button onClick={(e) => {
                        const panel = e.currentTarget.nextElementSibling as HTMLElement;
                        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                      }} style={{ background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 14, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span><i className="fa-solid fa-list" style={{ marginRight: 8 }} />មេរៀន ({course.lessons.length})</span>
                        <i className="fa-solid fa-chevron-down" style={{ fontSize: 12 }} />
                      </button>
                      <div style={{ display: 'none', padding: '12px 0 0', marginTop: 12 }}>
                        {course.lessons.map((lesson, li) => {
                          const isFav = favorites.some(f => f.link === lesson.link);
                          const toggleFav = () => {
                            let newFavs;
                            if (isFav) newFavs = favorites.filter(f => f.link !== lesson.link);
                            else newFavs = [...favorites, { name: lesson.name, link: lesson.link }];
                            setFavorites(newFavs);
                            if (currentUser?.uid) apiSaveFavorites(currentUser.uid, newFavs as any);
                          };
                          return (
                            <div key={li} style={{ padding: '10px 12px', background: 'rgba(15,23,42,0.5)', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                              <span style={{ flexGrow: 1, fontSize: 13, color: '#cbd5e1' }}>
                                <i className="fa-solid fa-play" style={{ marginRight: 8, color: '#3b82f6' }} />{lesson.name}
                              </span>
                              <button onClick={toggleFav} style={{ background: 'transparent', border: 'none', color: isFav ? '#fbbf24' : '#64748b', cursor: 'pointer', fontSize: 16 }}>
                                <i className={isFav ? "fa-solid fa-star" : "fa-regular fa-star"} />
                              </button>
                              <button onClick={() => { setVideoSrc(embedUrl(lesson.link)); markLessonDone(course.id, li); }} style={{ padding: '6px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                                ចាក់
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== STATS TAB ===== */}
          {activeTab === 'stats' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-chart-bar" style={{ color: '#2563eb' }} /> ស្ថិតិរបស់អ្នក
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
                <div style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.05))', borderRadius: 16, padding: 24, border: '1px solid rgba(37,99,235,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <i className="fa-solid fa-book" style={{ fontSize: 28, color: '#3b82f6' }} />
                    <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>មេរៀនបានបញ្ចប់</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f8fafc' }}>{completedLessons.length}</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg,rgba(6,214,160,0.2),rgba(6,214,160,0.05))', borderRadius: 16, padding: 24, border: '1px solid rgba(6,214,160,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <i className="fa-solid fa-certificate" style={{ fontSize: 28, color: '#06D6A0' }} />
                    <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>វិញ្ញាបនបត្រ</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f8fafc' }}>{passedExams.length}</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))', borderRadius: 16, padding: 24, border: '1px solid rgba(251,191,36,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <i className="fa-solid fa-clock" style={{ fontSize: 28, color: '#fbbf24' }} />
                    <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>ពេលវេលារៀន</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f8fafc' }}>{formatKhmer(learningSeconds)}</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg,rgba(244,63,94,0.2),rgba(244,63,94,0.05))', borderRadius: 16, padding: 24, border: '1px solid rgba(244,63,94,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <i className="fa-solid fa-star" style={{ fontSize: 28, color: '#ef4444' }} />
                    <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>ចំណូលចិត្ត</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f8fafc' }}>{favorites.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* ===== EXAMS TAB ===== */}
          {activeTab === 'exams' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 28, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-clipboard-question" style={{ color: '#f43f5e' }} /> ការប្រឡង និង Quiz
              </h2>

              {activeQuiz ? (
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                  <button onClick={() => { setActiveQuiz(null); setQuizAnswers({}); setQuizSubmitted(false); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px 16px', borderRadius: 8, fontSize: 14, marginBottom: 24 }}>
                    <i className="fa-solid fa-arrow-left" /> ត្រឡប់ក្រោយ
                  </button>

                  <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 20 }}>
                      {defaultCourses.find(c => c.id === activeQuiz)?.title} Quiz
                    </h3>

                    {quizQuestions[activeQuiz]?.map((q, qIdx) => (
                      <div key={q.id} style={{ marginBottom: 28, padding: '20px', background: 'rgba(15,23,42,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                          សំណួរ {qIdx + 1}: {q.question}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {q.options.map((option: any, oIdx: any) => (
                            <label key={oIdx} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: quizAnswers[q.id] === oIdx ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.05)', borderRadius: 8, border: quizAnswers[q.id] === oIdx ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}>
                              <input type="radio" name={`q-${q.id}`} checked={quizAnswers[q.id] === oIdx} onChange={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })} style={{ marginRight: 12, cursor: 'pointer' }} disabled={quizSubmitted} />
                              <span style={{ color: '#cbd5e1', fontSize: 14 }}>{option}</span>
                              {quizSubmitted && (
                                <span style={{ marginLeft: 'auto', fontSize: 12, color: oIdx === q.correct ? '#10b981' : oIdx === quizAnswers[q.id] ? '#ef4444' : '#64748b' }}>
                                  {oIdx === q.correct ? '✓ ត្រឹមត្រូវ' : oIdx === quizAnswers[q.id] ? '✗ មិនត្រឹមត្រូវ' : ''}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button onClick={() => setQuizSubmitted(true)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#2563eb,#06D6A0)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600, marginTop: 12 }}>
                        ដាក់ស្នើ Quiz
                      </button>
                    ) : (
                      <div style={{ marginTop: 24, padding: '20px', background: 'rgba(16,185,129,0.15)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                        <div style={{ color: '#10b981', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                          <i className="fa-solid fa-check-circle" /> ការប្រឡងបានរួចរាល់!
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: 14 }}>
                          ពិន្ទុ៖ {Object.values(quizAnswers).filter((a, idx) => a === quizQuestions[activeQuiz][idx]?.correct).length} / {quizQuestions[activeQuiz]?.length || 0}
                        </div>
                        <button onClick={() => handlePassExam(activeQuiz)} style={{ marginTop: 14, padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                          ទទួលលទ្ធផល
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {defaultCourses.filter(isCourseDone).map((course) => (
                    <div key={course.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 24, border: passedExams.includes(course.id) ? '1px solid #10b981' : '1px solid #f43f5e' }}>
                      <i className={passedExams.includes(course.id) ? "fa-solid fa-circle-check" : "fa-solid fa-file-pen"} style={{ fontSize: 40, color: passedExams.includes(course.id) ? '#10b981' : '#f43f5e', marginBottom: 16 }} />
                      <h3 style={{ fontSize: 18, marginBottom: 12, color: '#f8fafc' }}>{course.title} Quiz</h3>
                      {passedExams.includes(course.id) ? (
                        <div style={{ color: '#10b981', fontWeight: 600 }}>
                          <i className="fa-solid fa-check" /> អ្នកបានប្រឡងជាប់
                        </div>
                      ) : (
                        <button onClick={() => setActiveQuiz(course.id)} style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                          ចាប់ផ្ដើម Quiz
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== FAVORITES TAB ===== */}
          {activeTab === 'favorites' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-star" style={{ color: '#fbbf24' }} /> មេរៀនដែលចូលចិត្ត
              </h2>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 20px', fontSize: 16 }}>
                  <i className="fa-solid fa-star" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} /><br/>
                  មិនទាន់មានមេរៀនដែលចូលចិត្ត
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                  {favorites.map((fav, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-play" />
                      </div>
                      <span style={{ flexGrow: 1, fontSize: 14, color: '#e2e8f0' }}>{fav.name}</span>
                      <button onClick={() => setVideoSrc(embedUrl(fav.link))} style={{ width: 36, height: 36, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        <i className="fa-solid fa-play" />
                      </button>
                      <button onClick={() => removeFav(fav)} style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== CERTIFICATES TAB ===== */}
          {activeTab === 'certificates' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 28, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-certificate" style={{ color: '#06D6A0' }} /> វិញ្ញាបនបត្ររបស់អ្នក
              </h2>
              {passedExams.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 20px', fontSize: 16 }}>
                  <i className="fa-solid fa-lock" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} /><br/>
                  អ្នកមិនទាន់មានវិញ្ញាបនបត្រនៅឡើយទេ
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                  {passedExams.map(id => {
                    const course = defaultCourses.find(c => c.id === id);
                    return course && (
                      <div key={id} style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '2px solid #06D6A0', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 8px 30px rgba(6,214,160,0.2)' }}>
                        <i className="fa-solid fa-award" style={{ fontSize: 56, color: '#06D6A0', marginBottom: 16 }} />
                        <h3 style={{ fontSize: 20, color: '#f8fafc', marginBottom: 12 }}>វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា</h3>
                        <h4 style={{ fontSize: 20, color: '#60a5fa', margin: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12 }}>{displayName}</h4>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>បានបញ្ចប់វគ្គសិក្សា៖</p>
                        <h5 style={{ fontSize: 18, color: '#f8fafc', margin: 0 }}>{course.title}</h5>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== ACTIVITY TAB ===== */}
          {activeTab === 'activity' && (
            <div>
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-history" style={{ color: '#38bdf8' }} /> សកម្មភាពរបស់អ្នក
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <i className="fa-solid fa-book" />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>{completedLessons.length} មេរៀនបានបញ្ចប់</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>គ្រប់រយៈពេល</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <i className="fa-solid fa-certificate" />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>{passedExams.length} វិញ្ញាបនបត្របានទទួល</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>គ្រប់រយៈពេល</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                      <i className="fa-solid fa-star" />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>{favorites.length} មេរៀនបានរក្សាទុក</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>ម្តងម្កាល</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: 1100 }}>
              <h2 style={{ color: '#f8fafc', marginBottom: 28, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-user" /> ប្រវត្តិរូបរបស់អ្នក
              </h2>

              {/* Profile Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
                {[
                  { id: 'overview', label: 'ទូទៅ', icon: 'fa-user' },
                  { id: 'education', label: 'ការศึกษា', icon: 'fa-graduation-cap' },
                  { id: 'experience', label: 'បទពិសោធន៍', icon: 'fa-briefcase' },
                  { id: 'skills', label: 'ជំនាញ', icon: 'fa-code' },
                  { id: 'preferences', label: 'ចូលចិត្ត', icon: 'fa-sliders' },
                  { id: 'privacy', label: 'ឯកសម្ងាត់', icon: 'fa-lock' },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setProfileTab(tab.id as any)} style={{
                    padding: '12px 16px', background: profileTab === tab.id ? 'rgba(37,99,235,0.2)' : 'transparent',
                    border: profileTab === tab.id ? '1px solid #2563eb' : 'none', borderRadius: 8, color: profileTab === tab.id ? '#60a5fa' : '#94a3b8',
                    cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap', borderBottom: profileTab === tab.id ? '2px solid #2563eb' : '2px solid transparent'
                  }}>
                    <i className={`fa-solid ${tab.icon}`} style={{ marginRight: 6 }} />{tab.label}
                  </button>
                ))}
              </div>

              {/* Profile Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, marginBottom: 32 }}>
                {/* Profile Picture */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#06D6A0)', overflow: 'hidden', marginBottom: 16, border: '3px solid rgba(255,255,255,0.1)' }}>
                    <img src={userProfile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', marginBottom: 12 }}>
                    <i className="fa-solid fa-camera" /> ផ្លាស់ប្តូរ
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>

                {/* Profile Content */}
                <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {profileTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>ឈ្មោះ</div>
                        <div style={{ fontSize: 16, color: '#f8fafc', fontWeight: 600 }}>{displayName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>អ៊ីមែល</div>
                        <div style={{ fontSize: 16, color: '#f8fafc' }}>{currentUser?.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>កាលបរិច្ឆេទចូលរៀន</div>
                        <div style={{ fontSize: 16, color: '#f8fafc' }}>{userProfile.joinDate}</div>
                      </div>
                      {!editingProfile ? (
                        <button onClick={() => setEditingProfile(true)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', marginTop: 12 }}>
                          <i className="fa-solid fa-pen" /> កែសម្រួល
                        </button>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {[
                            { label: 'ជីវប្រវត្តិ', key: 'bio' },
                            { label: 'លេខទូរស័ព្ទ', key: 'phone' },
                            { label: 'ទីកន្លែង', key: 'location' },
                            { label: 'គេហទំព័របាន', key: 'website' },
                            { label: 'GitHub', key: 'github' },
                            { label: 'LinkedIn', key: 'linkedin' },
                            { label: 'Twitter', key: 'twitter' },
                          ].map(({ label, key }) => (
                            <div key={key}>
                              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
                              <input
                                type="text"
                                value={(userProfile as any)[key] || ''}
                                onChange={(e) => setUserProfile({ ...userProfile, [key]: e.target.value } as any)}
                                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                              />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={saveProfileChanges} style={{ flexGrow: 1, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                              រក្សាទុក
                            </button>
                            <button onClick={() => setEditingProfile(false)} style={{ flexGrow: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                              បោះបង់
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {profileTab === 'education' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { label: 'សាលលេខ/សាកលវិទ្យាល័យ', key: 'school' },
                        { label: 'ដឺក្រេ/សញ្ញាប័ត្រ', key: 'degree' },
                        { label: 'ក្ষេត្រសិក្សា', key: 'field' },
                        { label: 'ឆ្នាំបញ្ចប់', key: 'graduationYear' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
                          <input
                            type="text"
                            value={(userProfile as any)[key] || ''}
                            onChange={(e) => setUserProfile({ ...userProfile, [key]: e.target.value } as any)}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                          />
                        </div>
                      ))}
                      <button onClick={saveProfileChanges} style={{ marginTop: 12, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                        រក្សាទុក
                      </button>
                    </div>
                  )}

                  {profileTab === 'experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { label: 'ក្រុមហ៊ុន', key: 'company' },
                        { label: 'មុខងារ', key: 'jobTitle' },
                        { label: 'ឆ្នាំបទពិសោធន៍', key: 'yearsExp' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
                          <input
                            type="text"
                            value={(userProfile as any)[key] || ''}
                            onChange={(e) => setUserProfile({ ...userProfile, [key]: e.target.value } as any)}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                          />
                        </div>
                      ))}
                      <button onClick={saveProfileChanges} style={{ marginTop: 12, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                        រក្សាទុក
                      </button>
                    </div>
                  )}

                  {profileTab === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>ការសរសេរកម្មវិធី (ឃ្លាដាច់)</label>
                        <input
                          type="text"
                          placeholder="React, Python, JavaScript, ..."
                          value={userProfile.skills.join(', ')}
                          onChange={(e) => setUserProfile({ ...userProfile, skills: e.target.value.split(',').map(s => s.trim()) })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>ភាសា (ឃ្លាដាច់)</label>
                        <input
                          type="text"
                          placeholder="ខ្មែរ, អង់គ្លេស, ចិន, ..."
                          value={userProfile.languages.join(', ')}
                          onChange={(e) => setUserProfile({ ...userProfile, languages: e.target.value.split(',').map(s => s.trim()) })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                        />
                      </div>
                      <button onClick={saveProfileChanges} style={{ marginTop: 12, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                        រក្សាទុក
                      </button>
                    </div>
                  )}

                  {profileTab === 'preferences' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', cursor: 'pointer' }}>
                          <input type="checkbox" checked={userProfile.emailNotifications} onChange={(e) => setUserProfile({ ...userProfile, emailNotifications: e.target.checked })} style={{ cursor: 'pointer' }} />
                          ទទួលលទ្ធផលប្រឹក្សាយោបល់តាមរយៈ Email
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', cursor: 'pointer' }}>
                          <input type="checkbox" checked={userProfile.pushNotifications} onChange={(e) => setUserProfile({ ...userProfile, pushNotifications: e.target.checked })} style={{ cursor: 'pointer' }} />
                          ទទួលលទ្ធផលការជូនដំណឹង
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>ពណ៌ប្រធានបទ</label>
                        <select value={userProfile.theme} onChange={(e) => setUserProfile({ ...userProfile, theme: e.target.value as any })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit' }}>
                          <option value="dark">ងងឹត</option>
                          <option value="light">밝음</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>ភាសា</label>
                        <select value={userProfile.language} onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value as any })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit' }}>
                          <option value="km">ខ្មែរ</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <button onClick={saveProfileChanges} style={{ marginTop: 12, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                        រក្សាទុក
                      </button>
                    </div>
                  )}

                  {profileTab === 'privacy' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>ការមើលឃើញ</label>
                        <select value={userProfile.profileVisibility} onChange={(e) => setUserProfile({ ...userProfile, profileVisibility: e.target.value as any })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit' }}>
                          <option value="public">សាធារណៈ</option>
                          <option value="private">ឯកជន</option>
                          <option value="friends">មិត្ត</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', cursor: 'pointer' }}>
                          <input type="checkbox" checked={userProfile.showActivity} onChange={(e) => setUserProfile({ ...userProfile, showActivity: e.target.checked })} style={{ cursor: 'pointer' }} />
                          បង្ហាញសកម្មភាពរបស់ខ្ញុំ
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', cursor: 'pointer' }}>
                          <input type="checkbox" checked={userProfile.allowMessages} onChange={(e) => setUserProfile({ ...userProfile, allowMessages: e.target.checked })} style={{ cursor: 'pointer' }} />
                          ឲ្យមនុស្សផ្សេងទៀតផ្ញើសារទៅមខ្ញុំ
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', cursor: 'pointer' }}>
                          <input type="checkbox" checked={userProfile.dataTracking} onChange={(e) => setUserProfile({ ...userProfile, dataTracking: e.target.checked })} style={{ cursor: 'pointer' }} />
                          អនុញ្ញាតឱ្យតាមដានទិន្នន័យ
                        </label>
                      </div>
                      <button onClick={saveProfileChanges} style={{ marginTop: 12, padding: '10px', background: '#06D6A0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                        រក្សាទុក
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 800 }}>
              <h2 style={{ color: '#f8fafc', marginBottom: 24, fontSize: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fa-solid fa-cog" style={{ color: '#a5b4fc' }} /> ការកំណត់ប្រព័ន្ធ
              </h2>
              <div style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#f8fafc', marginBottom: 12, fontSize: 16 }}>ឧបករណ៍ និងលក្ខណៈពិសេស</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button style={{ padding: '10px 16px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, color: '#60a5fa', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <i className="fa-solid fa-download" style={{ marginRight: 10 }} /> ធ្វើឡើងវិញនូវលក្ខណៈពិសេស
                      </button>
                      <button style={{ padding: '10px 16px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, color: '#60a5fa', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <i className="fa-solid fa-undo" style={{ marginRight: 10 }} /> ស្ដារលក្ខណៈកំណត់ស្វ័យលំនាំ
                      </button>
                    </div>
                  </div>

                  <div style={{ paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#f8fafc', marginBottom: 12, fontSize: 16 }}>ទិន្នន័យ</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button style={{ padding: '10px 16px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, color: '#fbbf24', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <i className="fa-solid fa-download" style={{ marginRight: 10 }} /> ដោះស្រាយលក្ខណៈពិសេសរបស់ខ្ញុំ
                      </button>
                      <button style={{ padding: '10px 16px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, color: '#fbbf24', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                        <i className="fa-solid fa-trash" style={{ marginRight: 10 }} /> លុបលក្ខណៈពិសេសរបស់ខ្ញុំ
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: '#f8fafc', marginBottom: 12, fontSize: 16 }}>ផ្សេងទៀត</h3>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <i className="fa-solid fa-right-from-bracket" /> ចាកចេញពីគណនី
                    </button>
                  </div>
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
