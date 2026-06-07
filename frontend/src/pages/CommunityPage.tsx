import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  category?: string;
  likes: string[];
  comments: Comment[];
  views?: number;
  createdAt: any;
}

export default function CommunityPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'popular'>('trending');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['general', 'question', 'achievement', 'help', 'resource', 'discussion'];
  const categoryIcons: Record<string, string> = {
    general: 'fa-comment',
    question: 'fa-circle-question',
    achievement: 'fa-trophy',
    help: 'fa-hand-holding-heart',
    resource: 'fa-book',
    discussion: 'fa-users'
  };

  // Fetch posts in real-time
  useEffect(() => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        
        // Apply filters
        if (filterCategory !== 'all') {
          fetchedPosts = fetchedPosts.filter(p => p.category === filterCategory);
        }
        if (searchTerm) {
          fetchedPosts = fetchedPosts.filter(p => 
            p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Viral Algorithm
        const now = Date.now();
        fetchedPosts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : now;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : now;
          
          const ageHoursA = (now - timeA) / (1000 * 60 * 60);
          const ageHoursB = (now - timeB) / (1000 * 60 * 60);
          
          const scoreA = (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
          const scoreB = (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;

          if (sortBy === 'trending') {
            const viralScoreA = (scoreA + 1) / Math.pow(Math.max(ageHoursA, 0) + 2, 1.5);
            const viralScoreB = (scoreB + 1) / Math.pow(Math.max(ageHoursB, 0) + 2, 1.5);
            return viralScoreB - viralScoreA;
          } else if (sortBy === 'popular') {
            return scoreB - scoreA;
          } else {
            return timeB - timeA;
          }
        });

        setPosts(fetchedPosts);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firestore might not be configured correctly yet.", err);
    }
  }, [sortBy, filterCategory, searchTerm]);

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || 'សិស្ស',
        authorPhoto: currentUser.photoURL || '',
        content: newPost.trim(),
        category: category,
        likes: [],
        comments: [],
        views: 0,
        createdAt: serverTimestamp(),
      });
      setNewPost('');
      setCategory('general');
    } catch (error) {
      console.error('Error posting:', error);
      alert('មានបញ្ហាក្នុងការបង្ហោះសារ។ សូមពិនិត្យមើល Firebase Rules។');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string, likes: string[]) => {
    if (!currentUser) return;
    const postRef = doc(db, 'posts', postId);
    try {
      if (likes.includes(currentUser.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e: FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const postRef = doc(db, 'posts', postId);
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email || 'សិស្ស',
      content: commentText.trim(),
      createdAt: Date.now(),
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      setCommentText('');
      setCommentingOn(null);
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('តើអ្នកពិតជាចង់លុបការបង្ហោះនេះមែនទេ?')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'ថ្មីៗ';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ឥឡូវនេះ';
    if (diffMins < 60) return `${diffMins}នាទីមុន`;
    if (diffHours < 24) return `${diffHours}ម៉ោងមុន`;
    if (diffDays < 7) return `${diffDays}ថ្ងៃមុន`;
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'short' }).format(date);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1724 0%, #1a2332 100%)', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif' }}>
      
      {/* Top navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 90 }}>
        <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 16 }}>
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <span style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-users" style={{ color: '#38bdf8' }} /> សហគមន៍ 
          <span style={{ fontSize: 12, background: 'rgba(59,130,246,0.3)', color: '#60a5fa', padding: '2px 8px', borderRadius: 12, fontWeight: 'normal' }}>
            {posts.length}
          </span>
        </span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Post Input Box */}
        <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))', borderRadius: 20, padding: 24, marginBottom: 28, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontWeight: 'bold', fontSize: 18 }}>
              <i className="fa-solid fa-user" />
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="តើអ្នកមានសំណួរកូដ ឬចង់ចែករំលែកអ្វីថ្ងៃនេះ?"
                rows={3}
                style={{ width: '100%', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, color: '#f8fafc', fontSize: 15, fontFamily: 'inherit', resize: 'none', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)',
                  border: category === cat ? '1px solid rgba(56,189,248,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  color: category === cat ? '#38bdf8' : '#94a3b8',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <i className={`fa-solid ${categoryIcons[cat]}`} style={{ fontSize: 12 }} />
                {cat === 'general' ? 'ទូទៅ' : cat === 'question' ? 'សំណួរ' : cat === 'achievement' ? 'សមរម្យ' : cat === 'help' ? 'ជំនួយ' : cat === 'resource' ? 'ធនធាន' : 'ពិគ្រោះយោបល់'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                <i className="fa-solid fa-image" style={{ color: '#10b981' }} /> រូបភាព
              </button>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                <i className="fa-solid fa-code" style={{ color: '#f59e0b' }} /> កូដ
              </button>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                <i className="fa-solid fa-face-smile" style={{ color: '#ec4899' }} /> អារម្មណ៍
              </button>
            </div>
            <button onClick={handlePostSubmit} disabled={loading || !newPost.trim()} style={{ background: newPost.trim() ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'linear-gradient(135deg, #374151, #4b5563)', color: 'white', border: 'none', borderRadius: 22, padding: '10px 28px', fontWeight: 'bold', fontSize: 14, cursor: newPost.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8, boxShadow: newPost.trim() ? '0 4px 15px rgba(37,99,235,0.4)' : 'none' }}>
              {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-paper-plane" />} បង្ហោះ
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ស្វាគមន៍ស្វងគេ..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '10px 14px 10px 40px', color: '#f8fafc', fontSize: 14, outline: 'none' }}
              />
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            </div>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '10px 14px', color: '#f8fafc', fontSize: 14, cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">ប្រភេទ៖ ទាំងអស់</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'general' ? 'ទូទៅ' : cat === 'question' ? 'សំណួរ' : cat === 'achievement' ? 'សមរម្យ' : cat === 'help' ? 'ជំនួយ' : cat === 'resource' ? 'ធនធាន' : 'ពិគ្រោះយោបល់'}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '10px 14px', color: '#f8fafc', fontSize: 14, cursor: 'pointer', outline: 'none' }}
          >
            <option value="trending">🔥 ល្បីល្បាច</option>
            <option value="latest">🕐 ថ្មីៗ</option>
            <option value="popular">👍 ពេញនិយម</option>
          </select>
        </div>

        {/* Feed List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 600px), 1fr))', gap: 20 }}>
          {posts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <i className="fa-regular fa-comments" style={{ fontSize: 56, marginBottom: 20, opacity: 0.4 }} />
              <p style={{ fontSize: 16, marginBottom: 8 }}>មិនទាន់មានការចែករំលែកទេ។</p>
              <p style={{ fontSize: 14, opacity: 0.7 }}>ចាប់ផ្ដើមបង្ហោះមុនគេ!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,189,248,0.15)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'}>
                <div style={{ padding: 22 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, flexShrink: 0 }}>
                        {post.authorPhoto ? <img src={post.authorPhoto} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <i className="fa-solid fa-user" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {post.authorName}
                          {post.authorId === currentUser?.uid && <span style={{ fontSize: 10, background: 'rgba(56,189,248,0.25)', color: '#38bdf8', padding: '3px 8px', borderRadius: 12, fontWeight: '600' }}>អ្នក</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span>{formatTime(post.createdAt)}</span>
                          {post.category && <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                            <i className={`fa-solid ${categoryIcons[post.category]}`} />
                            {post.category === 'general' ? 'ទូទៅ' : post.category === 'question' ? 'សំណួរ' : post.category === 'achievement' ? 'សមរម្យ' : post.category === 'help' ? 'ជំនួយ' : post.category === 'resource' ? 'ធនធាន' : 'ពិគ្រោះយោបល់'}
                          </span>}
                        </div>
                      </div>
                    </div>
                    {post.authorId === currentUser?.uid && (
                      <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 6, transition: 'color 0.3s', fontSize: 18 }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 18, maxHeight: 200, overflow: 'hidden' }}>
                    {post.content}
                  </div>

                  {/* Stats & Actions */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'flex', gap: 20, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                      <button onClick={() => toggleLike(post.id, post.likes || [])} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: post.likes?.includes(currentUser?.uid || '') ? '#ef4444' : '#94a3b8', transition: 'all 0.2s', flex: 1, justifyContent: 'center', padding: '8px 0', borderRadius: 10, fontSize: 15 }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <i className={post.likes?.includes(currentUser?.uid || '') ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ fontSize: 17 }} />
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      <button onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', transition: 'all 0.2s', flex: 1, justifyContent: 'center', padding: '8px 0', borderRadius: 10, fontSize: 15 }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56,189,248,0.1)'; e.currentTarget.style.color = '#38bdf8'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                        <i className="fa-regular fa-comment" style={{ fontSize: 17 }} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', transition: 'all 0.2s', flex: 1, justifyContent: 'center', padding: '8px 0', borderRadius: 10, fontSize: 15 }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.color = '#10b981'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                        <i className="fa-solid fa-share" style={{ fontSize: 17 }} />
                        ចែករំលែក
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {commentingOn === post.id && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px 22px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="សរសេរមតិរបស់អ្នក..."
                        style={{ flexGrow: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '10px 16px', color: '#f8fafc', fontSize: 14, outline: 'none' }}
                      />
                      <button type="submit" disabled={!commentText.trim()} style={{ background: commentText.trim() ? 'rgba(56,189,248,0.2)' : 'transparent', border: '1px solid ' + (commentText.trim() ? 'rgba(56,189,248,0.4)' : 'transparent'), color: commentText.trim() ? '#38bdf8' : '#64748b', cursor: commentText.trim() ? 'pointer' : 'default', fontSize: 18, borderRadius: 20, padding: '8px 14px', transition: 'all 0.3s' }}>
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {post.comments?.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: '10px 0' }}>មិនទាន់មានមតិ</div>
                      ) : (
                        post.comments?.map(comment => (
                          <div key={comment.id} style={{ display: 'flex', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <i className="fa-solid fa-user" style={{ color: '#38bdf8', fontSize: 13 }} />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '11px 14px', borderRadius: 14, borderTopLeftRadius: 4, flex: 1 }}>
                              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>{comment.authorName}</div>
                              <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>{comment.content}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-user" style={{ color: '#94a3b8' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: 15, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {post.authorName}
                          {post.authorId === currentUser?.uid && <span style={{ fontSize: 10, background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: 10 }}>អ្នក</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{formatTime(post.createdAt)}</div>
                      </div>
                    </div>
                    {post.authorId === currentUser?.uid && (
                      <button onClick={() => handleDeletePost(post.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </button>
                    )}
                  </div>
                  
                  <div style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                    {post.content}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', gap: 24 }}>
                    <button onClick={() => toggleLike(post.id, post.likes || [])} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: post.likes?.includes(currentUser?.uid || '') ? '#ef4444' : '#94a3b8', transition: 'color 0.2s' }}>
                      <i className={post.likes?.includes(currentUser?.uid || '') ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ fontSize: 16 }} />
                      <span style={{ fontSize: 14 }}>{post.likes?.length || 0}</span>
                    </button>
                    <button onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', transition: 'color 0.2s' }}>
                      <i className="fa-regular fa-comment" style={{ fontSize: 16 }} />
                      <span style={{ fontSize: 14 }}>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {commentingOn === post.id && (
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="សរសេរមតិរបស់អ្នក..."
                        style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 16px', color: '#f8fafc', fontSize: 14, outline: 'none' }}
                      />
                      <button type="submit" disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: commentText.trim() ? '#38bdf8' : '#64748b', cursor: commentText.trim() ? 'pointer' : 'default', fontSize: 18 }}>
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {post.comments?.map(comment => (
                        <div key={comment.id} style={{ display: 'flex', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                            <i className="fa-solid fa-user" style={{ color: '#94a3b8', fontSize: 12 }} />
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 14, borderTopLeftRadius: 4 }}>
                            <div style={{ fontWeight: 'bold', fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>{comment.authorName}</div>
                            <div style={{ fontSize: 14, color: '#cbd5e1' }}>{comment.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
