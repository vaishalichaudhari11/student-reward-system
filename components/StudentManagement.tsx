import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { TimeCreditIcon, PersonIcon } from './Icons';

interface StudentManagementProps {
    students: User[];
    onAddStudent: (student: Omit<User, 'id' | 'role'>) => void;
    onAddStudentsBulk: (students: Omit<User, 'id' | 'role'>[]) => void;
    onEditStudent: (student: User) => void;
    onRemoveStudent: (studentId: string) => void;
    onViewProfile: (studentId: string) => void;
    onActAs: (studentId: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAddStudent, onAddStudentsBulk, onEditStudent, onRemoveStudent, onViewProfile, onActAs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [newStudent, setNewStudent] = useState({ name: '', email: '', credits: 0 });
    const [editingStudent, setEditingStudent] = useState<User | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<User | null>(null);
    const [formError, setFormError] = useState('');
    const [bulkReport, setBulkReport] = useState<{success: number, failures: {reason: string, data: string}[]}|null>(null);

    const filteredStudents = useMemo(() =>
        students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [students, searchTerm]);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!newStudent.name || !newStudent.email) {
            setFormError('Name and Email are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newStudent.email)) {
            setFormError('Invalid email format.');
            return;
        }
        if (students.some(s => s.email === newStudent.email)) {
            setFormError('A student with this email already exists.');
            return;
        }
        onAddStudent(newStudent);
        setNewStudent({ name: '', email: '', credits: 0 });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        onEditStudent(editingStudent);
        setEditingStudent(null);
    }

    const handleDeleteConfirm = () => {
        if (!studentToDelete) return;
        onRemoveStudent(studentToDelete.id);
        setStudentToDelete(null);
    }
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const header = lines.shift()?.toLowerCase().split(',').map(h => h.trim().replace(/"/g, '')) || [];
            
            const nameIndex = header.indexOf('name');
            const emailIndex = header.indexOf('email');
            const creditsIndex = header.indexOf('initialcredits');

            const validNewStudents: Omit<User, 'id'|'role'>[] = [];
            const failedEntries: {reason: string, data: string}[] = [];

            lines.forEach(line => {
                const data = line.split(',');
                const name = data[nameIndex]?.trim();
                const email = data[emailIndex]?.trim();
                const credits = parseInt(data[creditsIndex]?.trim() || '0', 10);

                if(!name || !email) {
                    failedEntries.push({reason: 'Missing name or email', data: line});
                } else if (!/\S+@\S+\.\S+/.test(email)) {
                    failedEntries.push({reason: 'Invalid email format', data: line});
                } else if (students.some(s => s.email === email) || validNewStudents.some(s => s.email === email)) {
                     failedEntries.push({reason: 'Duplicate email', data: line});
                } else {
                    validNewStudents.push({ name, email, credits: isNaN(credits) ? 0 : credits });
                }
            });
            
            if (validNewStudents.length > 0) {
                 onAddStudentsBulk(validNewStudents);
            }
            setBulkReport({success: validNewStudents.length, failures: failedEntries});
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    }
    
    const ActionButton: React.FC<{onClick: () => void, className: string, children: React.ReactNode, title: string}> = ({ onClick, className, children, title }) => (
        <button onClick={onClick} className={`px-2 py-2 text-sm rounded-md transition-colors ${className}`} title={title}>
            {children}
        </button>
    );

    return (
        <div className="p-8 animate-fade-in space-y-8">
             <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Student Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    {/* Add Student Form */}
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Add Student Individually</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input type="text" placeholder="Full Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            <input type="email" placeholder="Email Address" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            <input type="number" placeholder="Initial Time Credits (optional)" value={newStudent.credits} onChange={e => setNewStudent({...newStudent, credits: parseInt(e.target.value, 10) || 0})} className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                            {formError && <p className="text-sm text-red-400">{formError}</p>}
                            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors">Add Student</button>
                        </form>
                    </div>

                    {/* Bulk Upload */}
                     <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                         <h2 className="text-xl font-bold mb-4">Add Students in Bulk</h2>
                         <p className="text-sm text-slate-400 mb-4">Upload a CSV file with columns: `name`, `email`, `initialCredits` (optional).</p>
                         <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30"/>
                     </div>
                </div>

                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">All Students ({students.length})</h2>
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md mb-4 border border-slate-600"/>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <ul className="space-y-3">
                            {filteredStudents.map(student => (
                                <li key={student.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-md">
                                    <div>
                                        <p className="font-semibold text-white">{student.name}</p>
                                        <p className="text-sm text-slate-400">{student.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-sm">
                                            <TimeCreditIcon className="w-4 h-4 text-yellow-400"/>
                                            <span className="font-bold">{student.credits}</span>
                                        </div>
                                        <ActionButton onClick={() => onViewProfile(student.id)} className="bg-slate-600 hover:bg-slate-500" title="View Profile">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </ActionButton>
                                        <ActionButton onClick={() => onActAs(student.id)} className="bg-green-600 hover:bg-green-500" title="Act As Student">
                                           <PersonIcon className="w-4 h-4" />
                                        </ActionButton>
                                        <ActionButton onClick={() => setEditingStudent(student)} className="bg-blue-600 hover:bg-blue-500" title="Edit Student">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                        </ActionButton>
                                        <ActionButton onClick={() => setStudentToDelete(student)} className="bg-red-600 hover:bg-red-500" title="Remove Student">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </ActionButton>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full bg-slate-700 p-2 rounded-md"/>
                            <input type="email" value={editingStudent.email} onChange={e => setEditingStudent({...editingStudent, email: e.target.value})} className="w-full bg-slate-700 p-2 rounded-md"/>
                             <input type="number" value={editingStudent.credits} onChange={e => setEditingStudent({...editingStudent, credits: parseInt(e.target.value, 10) || 0})} className="w-full bg-slate-700 p-2 rounded-md"/>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setEditingStudent(null)} className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-md">Cancel</button>
                                <button type="submit" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
             {studentToDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                        <h2 className="text-2xl font-bold mb-2">Are you sure?</h2>
                        <p className="mb-6">Do you want to remove <span className="font-bold">{studentToDelete.name}</span>?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setStudentToDelete(null)} className="w-full px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-md">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md">Remove</button>
                        </div>
                    </div>
                </div>
            )}
             {bulkReport && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Bulk Upload Report</h2>
                        <p className="text-green-400 font-semibold">{bulkReport.success} students added successfully.</p>
                        {bulkReport.failures.length > 0 && <p className="text-red-400 font-semibold mt-1">{bulkReport.failures.length} entries failed.</p>}
                        {bulkReport.failures.length > 0 && (
                            <div className="mt-4 max-h-60 overflow-y-auto bg-slate-900 p-3 rounded-md text-sm space-y-2">
                                {bulkReport.failures.map((fail, index) => (
                                    <div key={index}>
                                        <p className="text-slate-400"><strong>Data:</strong> {fail.data}</p>
                                        <p className="text-red-400"><strong>Reason:</strong> {fail.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setBulkReport(null)} className="w-full mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;