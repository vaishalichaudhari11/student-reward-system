export enum UserRole {
  Student = 'Student',
  Faculty = 'Faculty',
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'quiz' | 'book';
}

export interface User {
  id:string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  achievements?: Achievement[];
  lastSpinDate?: string; // Format: YYYY-MM-DD
}

export enum TransactionType {
  EARN_ACADEMIC = 'Academic',
  EARN_PEER_LEARNING = 'Peer Learning',
  EARN_INNOVATION = 'Innovation',
  EARN_SOCIAL_IMPACT = 'Social Impact',
  EARN_SKILL_BUILDING = 'Skill Building',
  EARN_INTEGRITY = 'Integrity',
  EARN_QUIZ = 'Quiz',
  EARN_SPIN_WHEEL = 'Spin Wheel',
  SPEND_LIBRARY = 'Spend: Library',
  RETURN_LIBRARY = 'Return: Library',
}

export interface Transaction {
  id: string;
  timestamp: Date;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
}

export enum BookStatus {
  Available = 'Available',
  Borrowed = 'Borrowed',
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cost: number;
  status: BookStatus;
  borrowedBy?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  credits: number;
}

export interface QuizCategory {
  name: string;
  questions: QuizQuestion[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

export interface SpinWheelSegment {
  value: number;
  color: string;
}

export enum ActivityStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  description: string;
  status: ActivityStatus;
  submittedAt: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LIBRARY = 'LIBRARY',
  SPIN_WHEEL = 'SPIN_WHEEL',
  QUIZ = 'QUIZ',
  LEDGER = 'LEDGER',
  STUDENT_MANAGEMENT = 'STUDENT_MANAGEMENT',
  STUDENT_PROFILE = 'STUDENT_PROFILE',
  COMMUNITY = 'COMMUNITY',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE',
  JOIN_FACULTY = 'JOIN_FACULTY',
  ACTIVITY_FEED = 'ACTIVITY_FEED',
}
