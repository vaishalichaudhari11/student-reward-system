import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface CommunityProps {
    students: User[];
    onViewProfile: (studentId: string) => void;
}

const Community: React.FC<CommunityProps> = ({ students, onViewProfile }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() =>
        students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [students, searchTerm]);

    return (
        <div className="p-8 animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Student Community</h1>
                <input
                    type="text"
                    placeholder="Search for a student..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-72 bg-slate-800 p-2 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map(student => (
                    <button
                        key={student.id}
                        onClick={() => onViewProfile(student.id)}
                        className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg text-center hover:bg-slate-800 hover:border-cyan-500 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    >
                        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                            {student.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-white">{student.name}</h2>
                        <p className="text-sm text-slate-400">{student.role}</p>
                    </button>
                ))}
            </div>
             {filteredStudents.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-500">No students found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Community;
