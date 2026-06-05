// ============================================================
// userDataService.ts — All user learning data stored in Firestore
// Document path: users/{uid}
// ============================================================
import { db } from './firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';

export interface FavoriteItem {
  name: string;
  link: string;
  courseId?: string;
  courseTitle?: string;
  addedAt?: number;
}

export interface HistoryEntry {
  lessonId: string;
  lessonName: string;
  courseId: string;
  courseTitle: string;
  timestamp: number;
}

export interface UserLearningData {
  favorites: FavoriteItem[];
  completedLessons: string[];       // ["courseId-lessonIndex"]
  passedExams: string[];            // ["courseId"]
  learningHistory: HistoryEntry[];  // last 100 entries
  profile: Record<string, any>;
}

const DEFAULT_DATA: UserLearningData = {
  favorites: [],
  completedLessons: [],
  passedExams: [],
  learningHistory: [],
  profile: {},
};

// ── Subscribe to real-time updates ──────────────────────────
export function subscribeUserData(
  uid: string,
  onData: (data: UserLearningData) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const ref = doc(db, 'users', uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData({ ...DEFAULT_DATA, ...(snap.data() as UserLearningData) });
      } else {
        // First time — initialise the document
        setDoc(ref, DEFAULT_DATA).catch(console.error);
        onData({ ...DEFAULT_DATA });
      }
    },
    (err) => {
      console.error('[userDataService] snapshot error:', err);
      onError?.(err);
    },
  );
}

// ── One-time fetch (fallback) ────────────────────────────────
export async function fetchUserData(uid: string): Promise<UserLearningData> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) return { ...DEFAULT_DATA, ...(snap.data() as UserLearningData) };
  return { ...DEFAULT_DATA };
}

// ── Partial update helper ────────────────────────────────────
export async function patchUserData(
  uid: string,
  updates: Partial<UserLearningData>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), updates, { merge: true });
}

// ── Convenience: save favorites ──────────────────────────────
export function saveFavorites(uid: string, favorites: FavoriteItem[]) {
  return patchUserData(uid, { favorites });
}

// ── Convenience: save completed lessons ─────────────────────
export function saveCompletedLessons(uid: string, completedLessons: string[]) {
  return patchUserData(uid, { completedLessons });
}

// ── Convenience: save passed exams ──────────────────────────
export function savePassedExams(uid: string, passedExams: string[]) {
  return patchUserData(uid, { passedExams });
}

// ── Convenience: append history entry ───────────────────────
export function appendHistory(uid: string, existing: HistoryEntry[], entry: HistoryEntry) {
  const updated = [entry, ...existing].slice(0, 100);
  return patchUserData(uid, { learningHistory: updated });
}

// ── Convenience: save profile ────────────────────────────────
export function saveProfile(uid: string, profile: Record<string, any>) {
  return patchUserData(uid, { profile });
}
