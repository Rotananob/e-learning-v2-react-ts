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
  likes: string[];
  comments: Comment[];
  createdAt: any;
}

export default function CommunityPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Fetch posts in real-time
  useEffect(() => {
    // If Firebase isn't properly configured yet, we could use dummy data, but let's try Firestore first
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        
        // Viral Algorithm (Like Facebook/Reddit)
        // Score = (Likes * 2) + (Comments * 3)
        // Viral Rank = Score / (Age_In_Hours + 2)^1.5
        const now = Date.now();
        fetchedPosts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : now;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : now;
          
          const ageHoursA = (now - timeA) / (1000 * 60 * 60);
          const ageHoursB = (now - timeB) / (1000 * 60 * 60);
          
          const scoreA = (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
          const scoreB = (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;
          
          // Give base score of 1 to every post so new posts aren't always 0
          const viralScoreA = (scoreA + 1) / Math.pow(Math.max(ageHoursA, 0) + 2, 1.5);
          const viralScoreB = (scoreB + 1) / Math.pow(Math.max(ageHoursB, 0) + 2, 1.5);
          
          return viralScoreB - viralScoreA;
        });

        setPosts(fetchedPosts);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firestore might not be configured correctly yet.", err);
    }
  }, []);

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
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      setNewPost('');
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
    return new Intl.DateTimeFormat('km-KH', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1724', color: '#fff', fontFamily: '"Segoe UI",Roboto,"Noto Sans Khmer",sans-serif' }}>
      
      {/* Top navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(15,23,36,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 90 }}>
        <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 16 }}>
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <span style={{ fontWeight: 'bold', fontSize: 16, color: '#f8fafc', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-users" style={{ color: '#38bdf8' }} /> សហគមន៍ (Trending) <i className="fa-solid fa-fire" style={{ color: '#ef4444', fontSize: 14 }}/>
        </span>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Post Input Box */}
        <div style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#38bdf8,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, fontWeight: 'bold' }}>
              <i className="fa-solid fa-user" />
            </div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="តើអ្នកមានសំណួរកូដ ឬចង់ចែករំលែកអ្វីថ្ងៃនេះ?"
              rows={3}
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#f8fafc', fontSize: 15, fontFamily: 'inherit', resize: 'none', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <i className="fa-solid fa-image" style={{ color: '#10b981' }} /> រូបភាព
              </button>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <i className="fa-solid fa-code" style={{ color: '#f59e0b' }} /> កូដ
              </button>
            </div>
            <button onClick={handlePostSubmit} disabled={loading || !newPost.trim()} style={{ background: 'linear-gradient(135deg,#2563eb,#38bdf8)', color: 'white', border: 'none', borderRadius: 20, padding: '8px 24px', fontWeight: 'bold', fontSize: 14, cursor: newPost.trim() ? 'pointer' : 'not-allowed', opacity: newPost.trim() && !loading ? 1 : 0.6, display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-paper-plane" />} បង្ហោះ
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <i className="fa-regular fa-comments" style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
              <p>មិនទាន់មានការចែករំលែកទេ។ ចាប់ផ្ដើមបង្ហោះមុនគេ!</p>
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
