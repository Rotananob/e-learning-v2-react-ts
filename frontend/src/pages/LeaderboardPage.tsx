import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface UserData {
  id: string;
  displayName?: string;
  email?: string;
  learningTime?: number;
  learningSeconds?: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Query users sorted by learningSeconds (or learningTime depending on how the hook saves it)
      // Usually it's learningSeconds in the backend if using useLearningTimer
      const usersRef = collection(db, 'users');
      // Order by learningSeconds descending, limit to top 50
      const q = query(usersRef, orderBy('learningSeconds', 'desc'), limit(50));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        setLeaders(fetchedUsers);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.warn("Firestore error or no data:", err);
      setLoading(false);
    }
  }, []);

  const formatKhmer = (seconds: number | undefined) => {
    if (!seconds) return '០ វិនាទី';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = '';
    if (hours > 0) result += `${hours} ម៉ោង `;
    if (minutes > 0) result += `${minutes} នាទី `;
    result += `${secs} វិនាទី`;
    return result;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Navigation */}
        <div style={{ marginBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-arrow-left" /> ត្រឡប់ទៅក្រោយ
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/img/images/logo.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>Rotana Education</div>
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', color: '#fbbf24', fontSize: 32, marginBottom: 16 }}>
            <i className="fa-solid fa-trophy" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>តារាងអ្នកឈានមុខគេ</h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>ការខិតខំប្រឹងប្រែងរបស់អ្នក នឹងនាំអ្នកទៅកាន់ភាពជោគជ័យ!</p>
        </div>

        {/* Leaderboard List */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>កំពុងទាញយកទិន្នន័យ...</div>
          ) : leaders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>មិនទាន់មានទិន្នន័យនៅឡើយទេ</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {leaders.map((user, index) => {
                let medalColor = '#64748b'; // default
                if (index === 0) medalColor = '#fbbf24'; // Gold
                else if (index === 1) medalColor = '#94a3b8'; // Silver
                else if (index === 2) medalColor = '#b45309'; // Bronze

                return (
                  <div key={user.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', 
                    background: index < 3 ? `linear-gradient(90deg, ${medalColor}15, transparent)` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${index < 3 ? medalColor + '30' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 16,
                    transition: 'transform 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: '50%', 
                        background: index < 3 ? medalColor + '20' : 'rgba(255,255,255,0.05)',
                        color: medalColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: 18
                      }}>
                        {index < 3 ? <i className="fa-solid fa-medal" /> : `#${index + 1}`}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, color: '#f8fafc' }}>
                          {user.displayName || 'សិស្សមិនបញ្ចេញឈ្មោះ'}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                          <i className="fa-solid fa-clock" style={{ marginRight: 6 }} /> 
                          ម៉ោងសិក្សា
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: 16, color: '#06D6A0' }}>
                        {formatKhmer(user.learningSeconds)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
=======
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { getWeekId } from '../hooks/useLearningTimer';

interface LeaderEntry { uid: string; displayName: string; learningSeconds: number; coursesCompleted: number; }

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_ICONS = ['fa-trophy', 'fa-medal', 'fa-award'];

export default function LeaderboardPage() {
  const { currentUser } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [live, setLive] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    try {
      const weekId = getWeekId();
      const q = query(collection(db, `leaderboard_${weekId}`), orderBy('learningSeconds', 'desc'), limit(10));
      const unsub = onSnapshot(q, snap => {
        let fetched: LeaderEntry[] = [];
        if (!snap.empty) {
          fetched = snap.docs.map(d => ({
            uid: d.data().uid || d.id,
            displayName: d.data().displayName || 'Unknown',
            learningSeconds: d.data().learningSeconds || 0,
            coursesCompleted: d.data().coursesCompleted || 0,
          }));
        }
        
        // Pad array to always show 10 entries
        while (fetched.length < 10) {
          fetched.push({ uid: `empty-${fetched.length}`, displayName: '-', learningSeconds: 0, coursesCompleted: 0 });
        }

        setLeaders(fetched);
        setLive(true);
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }, () => { 
        // fallback empty
        setLeaders(Array(10).fill(null).map((_, i) => ({ uid: `empty-${i}`, displayName: '-', learningSeconds: 0, coursesCompleted: 0 })));
      });
      return unsub;
    } catch { 
      setLeaders(Array(10).fill(null).map((_, i) => ({ uid: `empty-${i}`, displayName: '-', learningSeconds: 0, coursesCompleted: 0 })));
    }
  }, []);

  const myName = currentUser?.displayName || currentUser?.email?.split('@')[0] || '';
  const myRealRank = leaders.findIndex(l => l.uid === currentUser?.uid || (l.displayName !== '-' && l.displayName === myName));
  const myRank = myRealRank !== -1 ? myRealRank + 1 : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f1724,#1e293b)', color: '#fff', fontFamily: "'Kantumruy Pro','Noto Sans Khmer',sans-serif", padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(90deg,#1e293b,#0f172a)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 20 }}><i className="fa-solid fa-arrow-left" /></Link>
        <i className="fa-solid fa-trophy" style={{ color: '#FFD700', fontSize: 24 }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Leaderboard អាទិត្យនេះ</h1>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: live ? '#06D6A0' : '#f59e0b' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: live ? '#06D6A0' : '#f59e0b', display: 'inline-block', animation: live ? 'pulse 1.5s infinite' : 'none' }} />
          {live ? 'Live Data' : 'Waiting for Data...'}
        </span>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 16px' }}>
        {/* Top 3 podium */}
        {leaders.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 32 }}>
            {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
              const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const heights = [120, 150, 100];
              const bgColors = ['rgba(192,192,192,0.15)', 'rgba(255,215,0,0.15)', 'rgba(205,127,50,0.15)'];
              return (
                <div key={l.uid} style={{ textAlign: 'center', flex: i === 1 ? 1.2 : 1, animation: pulse ? 'fadeIn 0.5s ease' : 'none' }}>
                  <div style={{ fontSize: 14, color: RANK_COLORS[realRank - 1], marginBottom: 4, fontWeight: 700 }}>{l.displayName}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{Math.floor(l.learningSeconds / 60)} នាទី</div>
                  <div style={{ height: heights[i], background: bgColors[i], border: `2px solid ${RANK_COLORS[realRank - 1]}`, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                    <i className={`fa-solid ${RANK_ICONS[realRank - 1]}`} style={{ color: RANK_COLORS[realRank - 1], fontSize: i === 1 ? 32 : 24 }} />
                    <span style={{ fontWeight: 700, fontSize: i === 1 ? 28 : 22, color: RANK_COLORS[realRank - 1] }}>#{realRank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My rank banner */}
        {myRank > 0 && (
          <div style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.25),rgba(6,214,160,0.15))', border: '1px solid rgba(37,99,235,0.4)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-user" style={{ color: '#60a5fa' }} />
            <span style={{ color: '#f8fafc', fontSize: 14 }}>ចំណាត់ថ្នាក់របស់អ្នក: <strong style={{ color: '#06D6A0' }}>#{myRank}</strong></span>
            <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 13 }}>{Math.floor(leaders[myRank - 1]?.learningSeconds / 60 || 0)} នាទី</span>
          </div>
        )}

        {/* Full list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leaders.map((l, i) => {
            const isMe = l.uid === currentUser?.uid || l.displayName === myName;
            const rank = i + 1;
            return (
              <div key={l.uid} style={{ background: isMe ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)', border: isMe ? '1px solid rgba(37,99,235,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', animation: pulse ? 'fadeIn 0.4s ease' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: rank <= 3 ? `${RANK_COLORS[rank - 1]}22` : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {rank <= 3
                    ? <i className={`fa-solid ${RANK_ICONS[rank - 1]}`} style={{ color: RANK_COLORS[rank - 1], fontSize: 16 }} />
                    : <span style={{ color: '#64748b', fontWeight: 700, fontSize: 14 }}>#{rank}</span>}
                </div>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `hsl(${(rank * 47) % 360},60%,50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {l.displayName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: isMe ? '#60a5fa' : '#f8fafc' }}>{l.displayName} {isMe && <span style={{ fontSize: 11, color: '#06D6A0' }}>(អ្នក)</span>}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}><i className="fa-solid fa-book-open" style={{ marginRight: 4 }} />{l.coursesCompleted} វគ្គ</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: rank <= 3 ? RANK_COLORS[rank - 1] : '#f8fafc' }}>{Math.floor(l.learningSeconds / 60)}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>នាទី</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#475569', fontSize: 13 }}>
          <i className="fa-solid fa-info-circle" style={{ marginRight: 6 }} />
          Top 10 ចំណាត់ថ្នាក់នេះត្រូវបាន Reset ជារៀងរាល់អាទិត្យដោយស្វ័យប្រវត្តិ។
>>>>>>> updates
        </div>
      </div>
    </div>
  );
}
