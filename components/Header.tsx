import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, AppView } from '../types';
import { TimeCreditIcon, ChevronDownIcon } from './Icons';

interface HeaderProps {
  user: User;
  onToggleUser: () => void;
  setView: (view: AppView) => void;
  facultyImpersonator: User | null;
  onStopImpersonating: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleUser, setView, facultyImpersonator, onStopImpersonating }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJoinClick = () => {
    setView(AppView.JOIN_FACULTY);
    setDropdownOpen(false);
  };
  
  const handleDemoLoginClick = () => {
    onToggleUser();
    setDropdownOpen(false);
  }

  return (
    <>
      {facultyImpersonator && (
        <div className="bg-yellow-500 text-slate-900 text-center p-2 font-semibold text-sm sticky top-0 z-50">
          Viewing as {user.name}.{' '}
          <button onClick={onStopImpersonating} className="underline font-bold hover:text-indigo-800">
            Return to Faculty View
          </button>
        </div>
      )}
      <header className="bg-slate-800/50 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-40">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          EduChain Time Credits
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-white">{facultyImpersonator ? facultyImpersonator.name : user.name}</p>
            <p className="text-sm text-slate-400">{facultyImpersonator ? `${facultyImpersonator.role} (Impersonating)` : user.role}</p>
          </div>
          {user.role === UserRole.Student && (
            <div className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-full">
              <TimeCreditIcon className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-lg text-white">{user.credits}</span>
            </div>
          )}
          {!facultyImpersonator && (
            <div className="relative" ref={dropdownRef}>
              {user.role === UserRole.Student ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
                  >
                    Faculty Portal
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button onClick={handleDemoLoginClick} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                          Login as Demo Faculty
                        </button>
                        <button onClick={handleJoinClick} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                          Register as Faculty
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={onToggleUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Switch to Student View
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
