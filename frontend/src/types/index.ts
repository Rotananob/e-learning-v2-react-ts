// TypeScript interfaces for the Rotana E-Learning project

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Lesson {
  id?: string;
  name: string;
  link: string;
  type?: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  isImage?: boolean;
  timestamp?: number;
}

export interface Favorite {
  name: string;
  link: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export interface LearningProgress {
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentage: number;
}

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: string;
  siteName?: string;
}
