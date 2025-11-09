import { User, UserRole, Book, BookStatus, QuizCategory, LeaderboardEntry, SpinWheelSegment, Activity, ActivityStatus, TransactionType } from './types';

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayISO = yesterday.toISOString().split('T')[0];

const today = new Date();
const todayISO = today.toISOString().split('T')[0];

export const DEFAULT_USER: User = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.j@university.edu',
  role: UserRole.Student,
  credits: 500,
  lastSpinDate: yesterdayISO, // Can spin today
  achievements: [
    { id: 'ach-01', name: 'Quiz Master', description: 'Scored 100+ points in quizzes.', icon: 'quiz' },
    { id: 'ach-02', name: 'Bookworm', description: 'Borrowed 5+ books from the library.', icon: 'book' },
  ]
};

export const FACULTY_USER: User = {
  id: 'faculty-001',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@university.edu',
  role: UserRole.Faculty,
  credits: 0, // Faculty doesn't use credits
};

export const INITIAL_STUDENTS: User[] = [
  DEFAULT_USER,
  { id: 'user-002', name: 'Priya Sharma', email: 'priya.s@university.edu', role: UserRole.Student, credits: 120, lastSpinDate: todayISO, achievements: [{ id: 'ach-03', name: 'Top Performer', description: 'Ranked #1 on the leaderboard.', icon: 'star' }] },
  { id: 'user-003', name: 'Rohan Gupta', email: 'rohan.g@university.edu', role: UserRole.Student, credits: 340, lastSpinDate: '2023-01-01', achievements: [] },
  { id: 'user-004', name: 'Anjali Verma', email: 'anjali.v@university.edu', role: UserRole.Student, credits: 850, achievements: [{ id: 'ach-01', name: 'Quiz Master', description: 'Scored 100+ points in quizzes.', icon: 'quiz' }] },
];

export const INITIAL_BOOKS: Book[] = [
  { id: 1, title: 'Smart Contract Development', author: 'Jane Doe', cost: 50, status: BookStatus.Available },
  { id: 2, title: 'Advanced React Patterns', author: 'John Smith', cost: 75, status: BookStatus.Available },
  { id: 3, title: 'The Decentralized Future', author: 'Alice Brown', cost: 60, status: BookStatus.Borrowed, borrowedBy: 'user-002' },
  { id: 4, title: 'UI/UX for Web3', author: 'Bob White', cost: 40, status: BookStatus.Available },
  { id: 5, title: 'Blockchain for Beginners', author: 'Clara Green', cost: 30, status: BookStatus.Borrowed, borrowedBy: 'user-001' },
  { id: 6, title: 'Mastering Tailwind CSS', author: 'Eve Black', cost: 45, status: BookStatus.Available },
];

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    name: 'General Science',
    questions: [
      { question: 'What is the process by which a cell divides into two new daughter cells called?', options: ['Meiosis', 'Mitosis', 'Fusion', 'Fission'], correctAnswer: 'Mitosis', credits: 10 },
      { question: 'What is the approximate speed of light in a vacuum?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], correctAnswer: '300,000 km/s', credits: 10 },
      { question: 'In physics, what is the unit of electrical resistance?', options: ['Watt', 'Volt', 'Ampere', 'Ohm'], correctAnswer: 'Ohm', credits: 10 },
      { question: 'Which gas makes up the majority of the Earth\'s atmosphere (about 78%)?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctAnswer: 'Nitrogen', credits: 10 },
      { question: 'What is the name of the galaxy that contains our Solar System?', options: ['Andromeda', 'Triangulum', 'Whirlpool', 'The Milky Way'], correctAnswer: 'The Milky Way', credits: 10 },
    ],
  },
  {
    name: 'Indian Epics',
    questions: [
      { question: 'In the Ramayana, what was the name of Ravana\'s flying chariot?', options: ['Garuda', 'Pushpaka Vimana', 'Airavata', 'Indra\'s Chariot'], correctAnswer: 'Pushpaka Vimana', credits: 15 },
      { question: 'Who was the guru of the Pandavas and Kauravas in the art of warfare?', options: ['Vishwamitra', 'Dronacharya', 'Vashistha', 'Parashurama'], correctAnswer: 'Dronacharya', credits: 15 },
      { question: 'What is the name of the conch shell blown by Lord Krishna in the Mahabharata?', options: ['Panchajanya', 'Devadatta', 'Anantavijaya', 'Paundra'], correctAnswer: 'Panchajanya', credits: 15 },
      { question: 'According to the Ramayana, who was the elder brother of Sugriva, the monkey king?', options: ['Hanuman', 'Jambavan', 'Vali', 'Angada'], correctAnswer: 'Vali', credits: 15 },
      { question: 'In the Mahabharata, who was the spiritual father of Yudhisthira?', options: ['Vayu', 'Indra', 'Yama', 'Surya'], correctAnswer: 'Yama', credits: 15 },
    ],
  },
  {
    name: 'World History',
    questions: [
      { question: 'The ancient city of Rome was famously built on how many hills?', options: ['Five', 'Seven', 'Nine', 'Ten'], correctAnswer: 'Seven', credits: 10 },
      { question: 'The Magna Carta, a foundational document for constitutional law, was signed in which year?', options: ['1066', '1215', '1492', '1776'], correctAnswer: '1215', credits: 10 },
      { question: 'Who was the first emperor of the Maurya Dynasty in ancient India?', options: ['Ashoka', 'Bindusara', 'Chandragupta Maurya', 'Samudragupta'], correctAnswer: 'Chandragupta Maurya', credits: 10 },
      { question: 'The Renaissance, a period of great cultural change, began in which country?', options: ['France', 'Spain', 'Greece', 'Italy'], correctAnswer: 'Italy', credits: 10 },
      { question: 'What event is considered the primary trigger for the start of World War I?', options: ['The sinking of the Lusitania', 'The invasion of Poland', 'The assassination of Archduke Franz Ferdinand', 'The Bolshevik Revolution'], correctAnswer: 'The assassination of Archduke Franz Ferdinand', credits: 10 },
    ],
  },
  {
    name: 'Current Affairs - Tech',
    questions: [
      { question: 'What does the acronym "LLM" stand for in the context of AI?', options: ['Low-Level Machine', 'Large Language Model', 'Linear Logic Module', 'Live Learning Machine'], correctAnswer: 'Large Language Model', credits: 20 },
      { question: 'Which cryptocurrency was the first to be created, introducing blockchain technology?', options: ['Ethereum', 'Ripple', 'Bitcoin', 'Litecoin'], correctAnswer: 'Bitcoin', credits: 20 },
      { question: 'Quantum computing uses what fundamental unit of information instead of classical bits?', options: ['Quants', 'Photons', 'Qubits', 'Superbits'], correctAnswer: 'Qubits', credits: 20 },
      { question: 'What is "Starlink"?', options: ['A NASA space telescope', 'A new video game console', 'A satellite internet constellation', 'An AI-powered search engine'], correctAnswer: 'A satellite internet constellation', credits: 20 },
      { question: 'Which company is behind the development of the popular "React" JavaScript library?', options: ['Google', 'Microsoft', 'Meta', 'Amazon'], correctAnswer: 'Meta', credits: 20 },
    ],
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya Sharma', score: 2450, avatar: 'https://picsum.photos/id/1027/100/100' },
  { rank: 2, name: 'Rohan Gupta', score: 2310, avatar: 'https://picsum.photos/id/1005/100/100' },
  { rank: 3, name: 'Anjali Verma', score: 2180, avatar: 'https://picsum.photos/id/1011/100/100' },
];

export const SPIN_WHEEL_SEGMENTS: SpinWheelSegment[] = [
  { value: 10, color: 'bg-blue-500' },
  { value: 50, color: 'bg-green-500' },
  { value: 5, color: 'bg-yellow-500' },
  { value: 100, color: 'bg-purple-500' },
  { value: 20, color: 'bg-red-500' },
  { value: 75, color: 'bg-indigo-500' },
  { value: 15, color: 'bg-pink-500' },
  { value: 0, color: 'bg-gray-600' },
];

export const COLLEGE_TOKEN = 'EDU-SECRET-2024';

export const QUIZ_TIME_LIMIT = 15 * 60; // 15 minutes in seconds
export const QUIZ_BONUS_REWARD = 10;

export const ACTIVITY_REWARDS: Partial<Record<TransactionType, number>> = {
  [TransactionType.EARN_ACADEMIC]: 50,
  [TransactionType.EARN_PEER_LEARNING]: 25,
  [TransactionType.EARN_INNOVATION]: 100,
  [TransactionType.EARN_SOCIAL_IMPACT]: 75,
  [TransactionType.EARN_SKILL_BUILDING]: 40,
  [TransactionType.EARN_INTEGRITY]: 15,
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    userId: 'user-001',
    userName: 'Alex Johnson',
    type: TransactionType.EARN_INNOVATION,
    description: 'Developed a prototype for a new decentralized voting system for the annual hackathon.',
    status: ActivityStatus.Pending,
    submittedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
  },
  {
    id: 'act-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    type: TransactionType.EARN_SOCIAL_IMPACT,
    description: 'Organized and led a campus-wide e-waste collection drive.',
    status: ActivityStatus.Pending,
    submittedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: 'act-003',
    userId: 'user-003',
    userName: 'Rohan Gupta',
    type: TransactionType.EARN_ACADEMIC,
    description: 'Published a research paper on the scalability of Layer 2 solutions.',
    status: ActivityStatus.Approved,
    submittedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: 'act-004',
    userId: 'user-001',
    userName: 'Alex Johnson',
    type: TransactionType.EARN_PEER_LEARNING,
    description: 'Conducted a weekly study group for the "Cryptography Basics" course.',
    status: ActivityStatus.Rejected,
    submittedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
  }
];
