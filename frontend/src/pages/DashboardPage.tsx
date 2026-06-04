import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoModal from '../components/common/VideoModal';
import { formatKhmer, useLearningTimer } from '../hooks/useLearningTimer';
import type { Favorite, Course } from '../types';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
<<<<<<< HEAD

// ======= EXTENDED COURSES DATA (20+ COURSES) =======
const defaultCourses: Course[] = [
  { id: 'web-basic', title: 'Web Basic (HTML/CSS/JS)', category: 'Web Development', description: 'រៀន HTML, CSS, JavaScript ពីដំបូង', icon: <i className="fa-solid fa-globe" />, lessons: [{ name: 'ភាគ ១: HTML Intro', link: 'https://www.youtube.com/embed/qz0aGYrrlhU' }, { name: 'ភាគ ២: CSS Basics', link: 'https://www.youtube.com/embed/yfoY53QXEnI' }, { name: 'ភាគ ៣: JavaScript Basics', link: 'https://www.youtube.com/embed/W6NZfCO5SIk' }, { name: 'ភាគ ៤: DOM Manipulation', link: 'https://www.youtube.com/embed/yfoY53QXEnI' }, { name: 'ភាគ ៥: Project ជាក់ស្ដែង', link: 'https://www.youtube.com/embed/qz0aGYrrlhU' }] },
  { id: 'react', title: 'React JS', category: 'Web Development', description: 'React.js + Hooks + TypeScript', icon: <i className="fa-brands fa-react" />, lessons: [{ name: 'ភាគ ១: React Intro', link: 'https://www.youtube.com/embed/w7ejDZ8SWv8' }, { name: 'ភាគ ២: Components & Props', link: 'https://www.youtube.com/embed/w7ejDZ8SWv8' }, { name: 'ភាគ ៣: React Hooks', link: 'https://www.youtube.com/embed/dpw9EHDh2bM' }, { name: 'ភាគ ៤: API Integration', link: 'https://www.youtube.com/embed/dpw9EHDh2bM' }] },
  { id: 'vue', title: 'Vue.js', category: 'Web Development', description: 'Vue 3 Framework ដែលរីករាយក្នុងការប្រើប្រាស់', icon: <i className="fa-brands fa-vuejs" />, lessons: [{ name: 'Vue Intro', link: 'https://www.youtube.com/embed/FXpIoQ_rT_c' }] },
  { id: 'nextjs', title: 'Next.js Fullstack', category: 'Web Development', description: 'Next.js 14 + TypeScript + Database', icon: <i className="fa-brands fa-neos" />, lessons: [{ name: 'Next.js Course', link: 'https://www.youtube.com/embed/ZjAqacIC_3c' }] },
  { id: 'tailwind', title: 'Tailwind CSS', category: 'Web Development', description: 'រចនា UI យ៉ាងលឿន ដោយ Tailwind', icon: <i className="fa-brands fa-css3-alt" />, lessons: [{ name: 'Tailwind Basics', link: 'https://www.youtube.com/embed/UBOj6rqRUME' }] },
  { id: 'typescript', title: 'TypeScript', category: 'Web Development', description: 'JavaScript ដែលមានប្រភេទ Type-Safe', icon: <i className="fa-solid fa-code" />, lessons: [{ name: 'TS Intro', link: 'https://www.youtube.com/embed/gieEQFIfgYc' }] },
  { id: 'python', title: 'Python Programming', category: 'Programming', description: 'Python ពីចាប់ផ្ដើមដល់ Advanced', icon: <i className="fa-brands fa-python" />, lessons: [{ name: 'ភាគ ១: Python Intro', link: 'https://www.youtube.com/embed/rfscVS0vtbw' }, { name: 'ភាគ ២: Variables & Types', link: 'https://www.youtube.com/embed/rfscVS0vtbw' }, { name: 'ភាគ ៣: Functions & OOP', link: 'https://www.youtube.com/embed/rfscVS0vtbw' }] },
  { id: 'java', title: 'Java Programming', category: 'Programming', description: 'Java OOP រៀង', icon: <i className="fa-brands fa-java" />, lessons: [{ name: 'Java Basics', link: 'https://www.youtube.com/embed/eIrMbAQSU34' }] },
  { id: 'cpp', title: 'C++ Programming', category: 'Programming', description: 'C++ សម្រាប់ Development', icon: <i className="fa-solid fa-code" />, lessons: [{ name: 'C++ Basics', link: 'https://www.youtube.com/embed/vLnPwxZdW4Y' }] },
  { id: 'csharp', title: 'C# .NET', category: 'Programming', description: 'C# សម្រាប់ Desktop & Web', icon: <i className="fa-brands fa-windows" />, lessons: [{ name: 'C# Intro', link: 'https://www.youtube.com/embed/GhQdlIFylQ8' }] },
  { id: 'go', title: 'Go Programming', category: 'Programming', description: 'Go Language ម៉ូដែននិង Fast', icon: <i className="fa-solid fa-code" />, lessons: [{ name: 'Go Basics', link: 'https://www.youtube.com/embed/yyUHQIec83I' }] },
  { id: 'php', title: 'PHP Backend', category: 'Programming', description: 'PHP សម្រាប់ Web Server', icon: <i className="fa-brands fa-php" />, lessons: [{ name: 'PHP Tutorial', link: 'https://www.youtube.com/embed/OK_JCtrrv-c' }] },
  { id: 'flutter', title: 'Flutter Mobile', category: 'Mobile', description: 'Flutter + Dart សម្រាប់ iOS/Android', icon: <i className="fa-solid fa-mobile-screen" />, lessons: [{ name: 'Flutter Intro', link: 'https://www.youtube.com/embed/1gDhl4leEzA' }] },
  { id: 'swift', title: 'Swift iOS', category: 'Mobile', description: 'Swift សម្រាប់ iOS Development', icon: <i className="fa-brands fa-apple" />, lessons: [{ name: 'Swift Basics', link: 'https://www.youtube.com/embed/KkSvVD9GYrw' }] },
  { id: 'kotlin', title: 'Kotlin Android', category: 'Mobile', description: 'Kotlin សម្រាប់ Android', icon: <i className="fa-solid fa-mobile" />, lessons: [{ name: 'Kotlin Intro', link: 'https://www.youtube.com/embed/S8e3VI1KGU8' }] },
  { id: 'sql', title: 'SQL Database', category: 'Data', description: 'SQL សម្រាប់ Database Management', icon: <i className="fa-solid fa-database" />, lessons: [{ name: 'SQL Basics', link: 'https://www.youtube.com/embed/19vT9Ro1TH8' }] },
  { id: 'mongodb', title: 'MongoDB', category: 'Data', description: 'NoSQL MongoDB Database', icon: <i className="fa-solid fa-leaf" />, lessons: [{ name: 'MongoDB Course', link: 'https://www.youtube.com/embed/ofme2o29ngU' }] },
  { id: 'docker', title: 'Docker', category: 'Tools', description: 'Docker Containerization', icon: <i className="fa-brands fa-docker" />, lessons: [{ name: 'Docker Tutorial', link: 'https://www.youtube.com/embed/pTFZFxd4hOI' }] },
  { id: 'git', title: 'Git & GitHub', category: 'Tools', description: 'Git Version Control System', icon: <i className="fa-brands fa-github" />, lessons: [{ name: 'Git Crash Course', link: 'https://www.youtube.com/embed/8JJ101D3knE' }] },
  { id: 'figma', title: 'Figma Design', category: 'Design', description: 'Figma UI/UX Design Tool', icon: <i className="fa-brands fa-figma" />, lessons: [{ name: 'Figma Course', link: 'https://www.youtube.com/embed/jwCmIBJ8Jtc' }] },
  { id: 'ai-ml', title: 'AI & Machine Learning', category: 'Data', description: 'Machine Learning + AI', icon: <i className="fa-solid fa-robot" />, lessons: [{ name: 'ML Basics', link: 'https://www.youtube.com/embed/GwIoAwOUzIU' }] },
];

const CATEGORIES = ['all', 'Web Development', 'Programming', 'Mobile', 'Game', 'Design', 'Data', 'Tools'];

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

// ======= QUIZ QUESTIONS (EXPANDED) =======
const quizQuestions: Record<string, any[]> = {
  'web-basic': [
    { id: 'q1', question: 'HTML តើប្រើសម្រាប់អ្វី?', options: ['រចនាសម្ព័ន្ធគេហទំព័រ', 'រចនាផ្នែក', 'ក្រាហ្វិក', 'ម៉ាស៊ីនម្ហូប'], correct: 0 },
    { id: 'q2', question: 'CSS តើប្រើសម្រាប់?', options: ['ដឹកនាំ', 'ទម្រង់', 'ក្រាហ្វិក', 'ឡូជីក'], correct: 1 },
    { id: 'q3', question: 'JavaScript ជា?', options: ['ឯកសារ', 'ភាសាសរសេរកម្មវិធី', 'ឧបករណ៍', 'ម៉ាកាប់'], correct: 1 },
    { id: 'q4', question: 'DIV តើប្រើសម្រាប់?', options: ['ដាក់ឯកសារ', 'រចនាសម្ព័ន្ធ', 'ឧបករណ៍', 'ទិន្នន័យ'], correct: 1 },
    { id: 'q5', question: 'CSS Box Model មាន?', options: ['2 ផ្នែក', '3 ផ្នែក', '4 ផ្នែក', '5 ផ្នែក'], correct: 2 },
  ],
  'react': [
    { id: 'q1', question: 'React គឺ?', options: ['ឧបករណ៍', 'ប្រអប់', 'បណ្ណាល័យ', 'ភាសា'], correct: 2 },
    { id: 'q2', question: 'useState ជា?', options: ['វាលបញ្ជូន', 'Hook', 'ឧបករណ៍', 'ប្រអប់'], correct: 1 },
    { id: 'q3', question: 'JSX គឺ?', options: ['ទ័ល', 'HTML+JS', 'ឡូជីក', 'គន្ថ'], correct: 1 },
    { id: 'q4', question: 'Props ប្រើ?', options: ['ដេលតា', 'ទិន្នន័យ', 'កូដ', 'ឧបករណ៍'], correct: 1 },
    { id: 'q5', question: 'Component ពីរ?', options: ['ប្រភេទ', 'មាត់', 'រៀង', 'លេខ'], correct: 0 },
  ],
  'python': [
    { id: 'q1', question: 'Python បង្កើត?', options: ['1980', '1991', '2000', '2010'], correct: 1 },
    { id: 'q2', question: 'Python ភាសា?', options: ['ល្អ', 'ងាយ', 'លឿន', 'ល្អ+ងាយ'], correct: 3 },
    { id: 'q3', question: 'Comment Python?', options: ['// គ', '# គ', '/* គ */', '<!-- គ -->'], correct: 1 },
    { id: 'q4', question: 'Python indent?', options: ['ជ្រើស', 'កាច', 'ដាច', 'សំខាន់'], correct: 3 },
    { id: 'q5', question: 'Python modules?', options: ['កម្មវិធី', 'ឯកសារ', 'កូដ', 'លេខ'], correct: 2 },
  ],
};
=======
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
>>>>>>> updates

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
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile') || '{}');
    } catch {
      return {
        bio: '', phone: '', location: '', website: '', github: '', linkedin: '', twitter: '',
        profileImage: 'https://ui-avatars.com/api/?name=' + (currentUser?.displayName || 'User'),
        joinDate: new Date().toLocaleDateString('km-KH'),
        school: '', degree: '', graduationYear: '', field: '',
        jobTitle: '', company: '', yearsExp: '',
        skills: [], languages: [],
        theme: 'dark', language: 'km', emailNotifications: true, pushNotifications: true,
        profileVisibility: 'public', showActivity: true, allowMessages: true, dataTracking: true,
      };
    }
  });

  // Learning data states
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
<<<<<<< HEAD
=======
  const [learningSeconds, setLearningSeconds] = useState(0);
>>>>>>> updates
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('completedLessons') || '[]'); } catch { return []; }
  });
  const [passedExams, setPassedExams] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('passedExams') || '[]'); } catch { return []; }
  });
<<<<<<< HEAD
  const [learningSeconds, setLearningSeconds] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { getSeconds } = useLearningTimer(currentUser?.uid);

  // Learning timer effect
=======
  const [activeTab, setActiveTab] = useState<'courses' | 'favorites' | 'profile' | 'certificates' | 'exams'>('courses');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { getSeconds } = useLearningTimer(currentUser?.uid, currentUser?.displayName || undefined);

>>>>>>> updates
  useEffect(() => {
    const id = setInterval(() => setLearningSeconds(getSeconds()), 1000);
    return () => clearInterval(id);
  }, [getSeconds]);

<<<<<<< HEAD
  // Firebase notifications
=======
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
>>>>>>> updates
  useEffect(() => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10));
      const unsub = onSnapshot(q, snap => {
        if (!snap.empty) {
          setNotifications(snap.docs.map(d => ({
            id: d.id,
            text: d.data().text || 'សារថ្មី',
            time: d.data().createdAt ? new Date(d.data().createdAt.toMillis()).toLocaleString() : 'ថ្មីៗនេះ',
<<<<<<< HEAD
            read: false
=======
            read: false // Simple read state
>>>>>>> updates
          })));
        }
      });
      return unsub;
    } catch {
      setNotifications([]);
    }
  }, []);

<<<<<<< HEAD
  // Helper functions
=======
  const unreadCount = notifications.filter(n => !n.read).length;

>>>>>>> updates
  const saveFavorites = (favs: Favorite[]) => {
    setFavorites(favs);
    localStorage.setItem('favorites', JSON.stringify(favs));
  };
  // const addFav = (f: Favorite) => { if (!favorites.find((x) => x.name === f.name)) saveFavorites([...favorites, f]); };
  const removeFav = (f: Favorite) => saveFavorites(favorites.filter((x) => x.name !== f.name));
  // const isFav = (f: Favorite) => !!favorites.find((x) => x.name === f.name);

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
<<<<<<< HEAD
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfile = { ...userProfile, profileImage: reader.result as string };
        setUserProfile(newProfile);
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    setEditingProfile(false);
    alert('ព័ត៌មានគណនីបានរក្សាទុកដោយជោគជ័យ!');
=======
>>>>>>> updates
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredCourses = defaultCourses.filter((c) => {
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
<<<<<<< HEAD
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
=======
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lessons.some((l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
>>>>>>> updates
    return matchCat && matchSearch;
  });

  const displayName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest');
<<<<<<< HEAD
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif' }}>
=======

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif', position: 'relative' }}>
>>>>>>> updates
      {sidebarOpen && window.innerWidth <= 768 && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
      )}

      {/* ===== SIDEBAR ===== */}
<<<<<<< HEAD
      <aside style={{
        width: sidebarOpen ? 280 : 0, minWidth: sidebarOpen ? 280 : 0,
=======
      <aside className="sidebar" style={{
        width: sidebarOpen ? 260 : 0, minWidth: sidebarOpen ? 260 : 0,
>>>>>>> updates
        background: 'linear-gradient(180deg,#1e293b,#0f172a)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease', overflow: 'hidden',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        top: 0, left: 0, height: '100%', zIndex: 110, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
<<<<<<< HEAD
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
=======
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
>>>>>>> updates
          </Link>

          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 8, marginTop: 20, paddingLeft: 8, fontWeight: 700 }}>Social Media</div>
          <div style={{ display: 'flex', gap: 10, padding: '0 10px' }}>
            <a href="#" style={{ color: '#3b5998', fontSize: 20 }}><i className="fa-brands fa-facebook" /></a>
            <a href="#" style={{ color: '#FF0000', fontSize: 20 }}><i className="fa-brands fa-youtube" /></a>
            <a href="#" style={{ color: '#0088cc', fontSize: 20 }}><i className="fa-brands fa-telegram" /></a>
            <a href="#" style={{ color: '#E1306C', fontSize: 20 }}><i className="fa-brands fa-instagram" /></a>
          </div>
        </div>

<<<<<<< HEAD
        <div style={{ padding: '16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
=======
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
>>>>>>> updates
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i className="fa-solid fa-right-from-bracket" /> ចាកចេញ
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top navbar */}
<<<<<<< HEAD
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 28px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20 }}>
            <i className="fa-solid fa-bars" />
          </button>
          
          <span style={{ fontWeight: 'bold', fontSize: 18, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-chalkboard-user" style={{ color: '#2563eb' }} />
            Dashboard Pro
          </span>

          <div style={{ position: 'relative', maxWidth: 340, width: '100%', display: window.innerWidth > 600 ? 'block' : 'none' }}>
=======
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 20, padding: '4px 8px' }}>
            <i className="fa-solid fa-bars" />
          </button>
          
          <span style={{ fontWeight: 'bold', fontSize: 18, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-chalkboard-user" style={{ color: '#2563eb' }} />
            Dashboard
          </span>

          <div style={{ position: 'relative', maxWidth: 320, width: '100%', display: window.innerWidth > 600 ? 'block' : 'none' }}>
>>>>>>> updates
            <input
              type="text"
              placeholder="ស្វែងរក..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
              style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
=======
              style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.3s' }}
>>>>>>> updates
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 14 }} />
          </div>

<<<<<<< HEAD
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
=======
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#f8fafc', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <i className="fa-solid fa-bell" style={{ fontSize: 18 }} />
              {unreadCount > 0 && (
                <span className="notif-count" style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10, border: '2px solid #0f1724' }}>
>>>>>>> updates
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
<<<<<<< HEAD
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
=======
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
>>>>>>> updates
          </div>
        </nav>

        {/* Content Area */}
<<<<<<< HEAD
        <div style={{ flexGrow: 1, padding: '28px', overflowY: 'auto' }}>
=======
        <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
>>>>>>> updates

          {/* ===== COURSES TAB ===== */}
          {activeTab === 'courses' && (
<<<<<<< HEAD
            <div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '8px 20px', borderRadius: 24, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: activeCategory === cat ? 'linear-gradient(135deg,#2563eb,#06D6A0)' : 'rgba(255,255,255,0.05)',
                      color: activeCategory === cat ? 'white' : '#94a3b8', transition: 'all 0.2s'
                    }}>
=======
            <div className="animate-fadeIn">
              {/* Category Filter */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    style={{ padding: '8px 20px', borderRadius: 24, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeCategory === cat ? 'linear-gradient(135deg,#2563eb,#06D6A0)' : 'rgba(255,255,255,0.05)', color: activeCategory === cat ? 'white' : '#94a3b8', transition: 'all 0.2s', boxShadow: activeCategory === cat ? '0 4px 12px rgba(37,99,235,0.3)' : 'none' }}>
>>>>>>> updates
                    {cat === 'all' ? 'ទាំងអស់' : cat}
                  </button>
                ))}
              </div>

<<<<<<< HEAD
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {filteredCourses.map((course) => {
=======
              {/* Courses Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {filteredCourses.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '60px 0', fontSize: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }} /><br/>
                    មិនមានវគ្គសម្រាប់ "<strong>{searchTerm || activeCategory}</strong>" ទេ
                  </div>
                ) : filteredCourses.map((course) => {
>>>>>>> updates
                  const lessonsDone = course.lessons.filter((_, i) => completedLessons.includes(`${course.id}-${i}`)).length;
                  const done = lessonsDone === course.lessons.length;
                  const progress = course.lessons.length > 0 ? Math.floor((lessonsDone / course.lessons.length) * 100) : 0;
                  
                  return (
                    <div key={course.id} style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
<<<<<<< HEAD
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(37,99,235,0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                          {course.icon}
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
                            localStorage.setItem('favorites', JSON.stringify(newFavs));
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
=======
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
>>>>>>> updates
                      </div>
                    </div>
                  );
                })}
              </div>
<<<<<<< HEAD
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
=======
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
>>>>>>> updates
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
