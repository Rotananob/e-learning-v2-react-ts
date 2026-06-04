import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        </div>
      </div>
    </div>
  );
}
