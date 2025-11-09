
import React from 'react';
import { User, UserRole, AppView, Transaction } from '../types';
import { TimeCreditIcon, LibraryIcon, SpinWheelIcon, QuizIcon, LedgerIcon } from './Icons';

interface DashboardProps {
  user: User;
  transactions: readonly Transaction[];
  setView: (view: AppView) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
        <div className="bg-slate-700 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, setView }) => {
    const userTransactions = transactions.filter(t => t.userId === user.id);
    const creditsEarned = userTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const creditsSpent = userTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Time Credits" 
                    value={user.credits}
                    icon={<TimeCreditIcon className="w-8 h-8 text-yellow-400" />} 
                />
                <StatCard 
                    title="Total Earned" 
                    value={creditsEarned}
                    icon={<div className="w-8 h-8 text-green-400 font-bold text-2xl flex items-center justify-center">+</div>}
                />
                <StatCard 
                    title="Total Spent" 
                    value={creditsSpent}
                    icon={<div className="w-8 h-8 text-red-400 font-bold text-2xl flex items-center justify-center">-</div>}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setView(AppView.LIBRARY)} className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                        <LibraryIcon className="w-10 h-10 text-blue-400 mb-2"/>
                        <span className="font-semibold">Library</span>
                    </button>
                    <button onClick={() => setView(AppView.QUIZ)} className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                        <QuizIcon className="w-10 h-10 text-purple-400 mb-2"/>
                        <span className="font-semibold">Quiz Zone</span>
                    </button>
                    <button onClick={() => setView(AppView.SPIN_WHEEL)} className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                        <SpinWheelIcon className="w-10 h-10 text-green-400 mb-2"/>
                        <span className="font-semibold">Bonus Wheel</span>
                    </button>
                     <button onClick={() => setView(AppView.LEDGER)} className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                        <LedgerIcon className="w-10 h-10 text-orange-400 mb-2"/>
                        <span className="font-semibold">Transaction Ledger</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
