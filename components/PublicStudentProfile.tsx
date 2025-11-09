import React from 'react';
import { User, Achievement } from '../types';
import { LibraryIcon, QuizIcon, StarIcon } from './Icons';

interface PublicStudentProfileProps {
  student: User;
  onBack: () => void;
}

const AchievementIcon: React.FC<{iconType: Achievement['icon'], className?: string}> = ({ iconType, className }) => {
    switch(iconType) {
        case 'star': return <StarIcon className={className} />;
        case 'quiz': return <QuizIcon className={className} />;
        case 'book': return <LibraryIcon className={className} />;
        default: return null;
    }
}

const PublicStudentProfile: React.FC<PublicStudentProfileProps> = ({ student, onBack }) => {
  return (
    <div className="p-8 animate-fade-in space-y-8">
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Community
            </button>
        </div>

      {/* Student Info Card */}
      <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg flex flex-col items-center text-center">
        <div className="w-28 h-28 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-5xl font-bold mb-4">
            {student.name.charAt(0)}
        </div>
        <h1 className="text-4xl font-bold text-white">{student.name}</h1>
        <p className="text-lg text-slate-400">{student.role}</p>
      </div>

      {/* Achievements */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><StarIcon className="w-7 h-7 text-yellow-400" /> Achievements</h2>
          {student.achievements && student.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.achievements.map(ach => (
                      <div key={ach.id} className="flex items-center gap-4 bg-slate-800 p-4 rounded-md border border-slate-700">
                         <div className="p-3 bg-slate-700 rounded-full">
                             <AchievementIcon iconType={ach.icon} className="w-6 h-6 text-indigo-400" />
                         </div>
                         <div>
                             <p className="font-semibold text-white">{ach.name}</p>
                             <p className="text-sm text-slate-400">{ach.description}</p>
                         </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-10">
                 <p className="text-slate-500">{student.name.split(' ')[0]} has no achievements yet.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default PublicStudentProfile;
