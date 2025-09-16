// User types
export interface Student {
  id: string;
  email: string;
  name: string;
  class: number; // 6, 7, 8, 9, 10, etc.
  created_at: string;
  trial_end_date: string;
  is_premium: boolean;
  updated_at: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  class: number;
  subject: string;
  thumbnail: string;
  total_videos: number;
  total_duration: number; // in minutes
  created_at: string;
  updated_at: string;
}

// Video types
export interface Video {
  id: string;
  title: string;
  description: string;
  course_id: string;
  class: number;
  chapter: string;
  video_url: string;
  thumbnail: string;
  duration: number; // in seconds
  order: number;
  created_at: string;
}

// Progress types
export interface VideoProgress {
  id: string;
  studentId: string;
  videoId: string;
  courseId: string;
  watchedDuration: number; // in seconds
  totalDuration: number; // in seconds
  completionPercentage: number; // 0-100
  isCompleted: boolean;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgress {
  courseId: string;
  completionPercentage: number; // 0-100
  completedVideos: number;
  totalVideos: number;
}

// Authentication types
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// Dashboard types
export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalVideosWatched: number;
  totalWatchTime: number; // in minutes
  currentStreak: number;
  lastLoginDate: Date;
}

// Payment types
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentDate: Date;
  expiryDate: Date;
  paymentMethod: string;
  transactionId: string;
}