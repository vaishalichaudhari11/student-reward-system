import React, { useState } from 'react';
import { User } from '../types';
import { COLLEGE_TOKEN } from '../constants';

interface JoinFacultyProps {
  onJoin: (facultyData: Omit<User, 'id' | 'role' | 'achievements'>) => void;
  onBack: () => void;
  existingFacultyEmails: string[];
}

const JoinFaculty: React.FC<JoinFacultyProps> = ({ onJoin, onBack, existingFacultyEmails }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Basic validation
    if (!name || !email || !token) {
      setError('All fields are required.');
      return;
    }

    // 2. Email domain validation
    if (!email.endsWith('@university.edu')) {
      setError('Please use your official university email (@university.edu).');
      return;
    }

    // 3. Token validation
    if (token !== COLLEGE_TOKEN) {
      setError('The provided token is incorrect.');
      return;
    }
    
    // 4. Duplicate email validation
    if (existingFacultyEmails.includes(email)) {
        setError('An account with this email already exists.');
        return;
    }

    // All good, call parent handler
    onJoin({ name, email, credits: 0 });
  };

  return (
    <div className="p-8 animate-fade-in flex items-center justify-center min-h-full">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Join the Faculty
          </h1>
          <p className="mt-2 text-center text-sm text-slate-400">
            Create your account using your official credentials.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-slate-800/50 border border-slate-700 p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
                placeholder="Full Name"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
                placeholder="Email Address (e.g., name@university.edu)"
              />
            </div>
            <div>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
                placeholder="College-Issued Token"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center py-2">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors text-white"
            >
              Register and Access Dashboard
            </button>
          </div>
           <div>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-center py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinFaculty;
