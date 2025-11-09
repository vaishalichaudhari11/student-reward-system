import React from 'react';
import { User, Transaction, Book, Achievement } from '../types';
import { TimeCreditIcon, LibraryIcon, QuizIcon, StarIcon, LedgerIcon } from './Icons';

interface StudentProfileProps {
  student: User;
  allTransactions: readonly Transaction[];
  allBooks: readonly Book[];
  onBack: () => void;
}

const getTransactionRowStyle = (type: string) => {
    if(type.startsWith('EARN')) return 'bg-green-500/10 text-green-300';
    if(type.startsWith('SPEND')) return 'bg-red-500/10 text-red-300';
    return 'bg-blue-500/10 text-blue-300';
}

const AchievementIcon: React.FC<{iconType: Achievement['icon'], className?: string}> = ({ iconType, className }) => {
    switch(iconType) {
        case 'star': return <StarIcon className={className} />;
        case 'quiz': return <QuizIcon className={className} />;
        case 'book': return <LibraryIcon className={className} />;
        default: return null;
    }
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, allTransactions, allBooks, onBack }) => {
  const studentTransactions = allTransactions.filter(t => t.userId === student.id).slice(0, 5); // Get latest 5
  const borrowedBooks = allBooks.filter(b => b.borrowedBy === student.id);

  return (
    <div className="p-8 animate-fade-in space-y-8">
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Student List
            </button>
        </div>

      {/* Student Info Card */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {student.name.charAt(0)}
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{student.name}</h1>
            <p className="text-slate-400">{student.email}</p>
            <p className="text-sm text-slate-500">{student.role}</p>
        </div>
        <div className="text-right">
            <p className="text-slate-400 text-sm">Time Credits</p>
            <div className="flex items-center gap-2 justify-end">
                <TimeCreditIcon className="w-8 h-8 text-yellow-400"/>
                <p className="text-4xl font-bold text-white">{student.credits}</p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LedgerIcon className="w-6 h-6 text-orange-400" /> Recent Activity</h2>
             {studentTransactions.length > 0 ? (
                <ul className="space-y-3">
                {studentTransactions.map(tx => (
                    <li key={tx.id} className={`flex justify-between items-center p-3 rounded-md ${getTransactionRowStyle(tx.type)}`}>
                        <div>
                            <p className="font-semibold">{tx.description}</p>
                            <p className="text-xs opacity-70">{tx.timestamp.toLocaleString()}</p>
                        </div>
                        <p className={`font-bold text-lg ${tx.amount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                             {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </p>
                    </li>
                ))}
            </ul>
             ) : (
                <p className="text-slate-500 text-center py-4">No recent transactions.</p>
             )}
        </div>
        
        {/* Achievements & Books */}
        <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><StarIcon className="w-6 h-6 text-yellow-400" /> Achievements</h2>
                {student.achievements && student.achievements.length > 0 ? (
                    <ul className="space-y-3">
                        {student.achievements.map(ach => (
                            <li key={ach.id} className="flex items-center gap-4 bg-slate-800 p-3 rounded-md">
                               <div className="p-2 bg-slate-700 rounded-full">
                                   <AchievementIcon iconType={ach.icon} className="w-6 h-6 text-indigo-400" />
                               </div>
                               <div>
                                   <p className="font-semibold">{ach.name}</p>
                                   <p className="text-sm text-slate-400">{ach.description}</p>
                               </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4">No achievements yet.</p>
                )}
            </div>

             <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LibraryIcon className="w-6 h-6 text-blue-400" /> Borrowed Books</h2>
                {borrowedBooks.length > 0 ? (
                     <ul className="space-y-3">
                        {borrowedBooks.map(book => (
                            <li key={book.id} className="bg-slate-800 p-3 rounded-md">
                                <p className="font-semibold">{book.title}</p>
                                <p className="text-sm text-slate-400">by {book.author}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4">No books currently borrowed.</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;