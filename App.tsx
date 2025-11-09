import React, { useState, useCallback } from 'react';
import { User, UserRole, AppView, Transaction, TransactionType, Book, BookStatus, Activity, ActivityStatus } from './types';
import { DEFAULT_USER, FACULTY_USER, INITIAL_STUDENTS, INITIAL_BOOKS, INITIAL_ACTIVITIES, ACTIVITY_REWARDS } from './constants';
import { blockchainService } from './services/blockchainService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import SpinWheel from './components/SpinWheel';
import QuizZone from './components/QuizZone';
import LedgerView from './components/LedgerView';
import StudentManagement from './components/StudentManagement';
import StudentProfile from './components/StudentProfile';
import Community from './components/Community';
import PublicStudentProfile from './components/PublicStudentProfile';
import JoinFaculty from './components/JoinFaculty';
import ActivityFeed from './components/ActivityFeed';
import { DashboardIcon, LibraryIcon, SpinWheelIcon, QuizIcon, LedgerIcon, UserManagementIcon, CommunityIcon, ActivityFeedIcon } from './components/Icons';


const App: React.FC = () => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [allStudents, setAllStudents] = useState<User[]>(INITIAL_STUDENTS);
  const [allFaculty, setAllFaculty] = useState<User[]>([FACULTY_USER]);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<readonly Transaction[]>(blockchainService.getLedger());
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [facultyImpersonator, setFacultyImpersonator] = useState<User | null>(null);
  
  const handleToggleUser = () => {
    if (facultyImpersonator) return; // Disable when impersonating
    setSelectedStudent(null);
    setUser(currentUser => {
       if (currentUser.role === UserRole.Student) {
            return allFaculty.find(f => f.id === FACULTY_USER.id) || FACULTY_USER;
        } else {
            const defaultStudent = allStudents.find(s => s.id === DEFAULT_USER.id) || DEFAULT_USER;
            return defaultStudent;
        }
    });
    setView(AppView.DASHBOARD);
  };

  const handleActAsStudent = (studentId: string) => {
    const studentToActAs = allStudents.find(s => s.id === studentId);
    if (studentToActAs && user.role === UserRole.Faculty) {
        setFacultyImpersonator(user);
        setUser(studentToActAs);
        setView(AppView.DASHBOARD);
    }
  };

  const handleStopImpersonating = () => {
    if (facultyImpersonator) {
        setUser(facultyImpersonator);
        setFacultyImpersonator(null);
        setView(AppView.DASHBOARD);
    }
  };
  
  const handleTransaction = useCallback((amount: number, type: TransactionType, description: string) => {
    if (user.role !== UserRole.Student) return;
    
    const newCredits = user.credits + amount;
    if (newCredits < 0 && type !== TransactionType.SPEND_LIBRARY) return;
    
    blockchainService.addTransaction({
        userId: user.id,
        type,
        amount,
        description,
    });
    setTransactions(blockchainService.getLedger());

    const updatedUser = { ...user, credits: newCredits };
    setUser(updatedUser);

    setAllStudents(currentStudents => 
        currentStudents.map(student => 
            student.id === user.id ? updatedUser : student
        )
    );
  }, [user]);

  const handleSpinTransaction = useCallback((amount: number, type: TransactionType, description: string) => {
    if (user.role !== UserRole.Student) return;
    
    const newCredits = user.credits + amount;
    
    blockchainService.addTransaction({
        userId: user.id,
        type,
        amount,
        description,
    });
    setTransactions(blockchainService.getLedger());
    
    const today = new Date().toISOString().split('T')[0];
    const updatedUser = { ...user, credits: newCredits, lastSpinDate: today };
    setUser(updatedUser);

    setAllStudents(currentStudents => 
        currentStudents.map(student => 
            student.id === user.id ? updatedUser : student
        )
    );
  }, [user]);

  const handleBorrowBook = (book: Book) => {
      handleTransaction(-book.cost, TransactionType.SPEND_LIBRARY, `Borrowed "${book.title}".`);
      setBooks(currentBooks => currentBooks.map(b =>
          b.id === book.id ? { ...b, status: BookStatus.Borrowed, borrowedBy: user.id } : b
      ));
  };

  const handleReturnBook = (book: Book) => {
      handleTransaction(book.cost, TransactionType.RETURN_LIBRARY, `Returned "${book.title}".`);
      setBooks(currentBooks => currentBooks.map(b =>
          b.id === book.id ? { ...b, status: BookStatus.Available, borrowedBy: undefined } : b
      ));
  };


  const handleAddStudent = (student: Omit<User, 'id' | 'role'>) => {
    setAllStudents(prev => {
        const newStudent: User = {
            ...student,
            id: `user-${Date.now()}`,
            role: UserRole.Student,
            achievements: [],
        };
        return [...prev, newStudent];
    });
  };

  const handleAddStudentsBulk = (students: Omit<User, 'id' | 'role'>[]) => {
    setAllStudents(prev => {
        const newStudents: User[] = students.map(s => ({
            ...s,
            id: `user-${Date.now()}-${Math.random()}`,
            role: UserRole.Student,
            achievements: [],
        }));
        return [...prev, ...newStudents];
    });
  };

  const handleEditStudent = (updatedStudent: User) => {
    setAllStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (user.id === updatedStudent.id) {
        setUser(updatedStudent);
    }
  };
  
  const handleRemoveStudent = (studentId: string) => {
    setAllStudents(prev => prev.filter(s => s.id !== studentId));
  };
  
  const handleViewProfile = (studentId: string) => {
      const studentToShow = allStudents.find(s => s.id === studentId);
      if (studentToShow) {
          setSelectedStudent(studentToShow);
          setView(AppView.STUDENT_PROFILE);
      }
  }

  const handleViewPublicProfile = (studentId: string) => {
      const studentToShow = allStudents.find(s => s.id === studentId);
      if (studentToShow) {
          setSelectedStudent(studentToShow);
          setView(AppView.PUBLIC_PROFILE);
      }
  }

  const handleJoinFaculty = (facultyData: Omit<User, 'id' | 'role' | 'achievements'>) => {
    const newFaculty: User = {
        ...facultyData,
        id: `faculty-${Date.now()}`,
        role: UserRole.Faculty,
    };
    setAllFaculty(prev => [...prev, newFaculty]);
    setUser(newFaculty);
    setView(AppView.DASHBOARD);
  };

  const handleActivitySubmit = (activityData: Omit<Activity, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName'>) => {
    const newActivity: Activity = {
        ...activityData,
        id: `act-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        status: ActivityStatus.Pending,
        submittedAt: new Date(),
    };
    setActivities(prev => [newActivity, ...prev].sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()));
  };

  const handleVerifyActivity = (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    setActivities(prev => prev.map(a => a.id === activityId ? { ...a, status: newStatus } : a));

    if (newStatus === ActivityStatus.Approved) {
        const reward = ACTIVITY_REWARDS[activity.type];
        if (reward && reward > 0) {
            const studentToUpdate = allStudents.find(s => s.id === activity.userId);
            if (studentToUpdate) {
                 blockchainService.addTransaction({
                    userId: studentToUpdate.id,
                    type: activity.type,
                    amount: reward,
                    description: `Activity approved: ${activity.description.substring(0, 50)}...`,
                });
                setTransactions(blockchainService.getLedger());

                const updatedStudent = { ...studentToUpdate, credits: studentToUpdate.credits + reward };
                
                setAllStudents(currentStudents => 
                    currentStudents.map(student => 
                        student.id === studentToUpdate.id ? updatedStudent : student
                    )
                );
                
                if(user.id === studentToUpdate.id) {
                    setUser(updatedStudent);
                }
            }
        }
    }
  };


  const NavItem: React.FC<{ icon: React.ReactNode; label: string; targetView: AppView; isFacultyOnly?: boolean, isStudentOnly?: boolean }> = ({ icon, label, targetView, isFacultyOnly = false, isStudentOnly = false }) => {
    if (isFacultyOnly && (user.role !== UserRole.Faculty || facultyImpersonator)) return null;
    if (isStudentOnly && (user.role !== UserRole.Student && !facultyImpersonator)) return null;
    
    const effectiveRole = facultyImpersonator ? UserRole.Student : user.role;
    if (isFacultyOnly && effectiveRole !== UserRole.Faculty) return null;
    if (isStudentOnly && effectiveRole !== UserRole.Student) return null;

    return (
        <button
            onClick={() => setView(targetView)}
            className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md w-full text-left transition-colors ${
                view === targetView ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
  };

  const renderView = () => {
    switch(view) {
        case AppView.DASHBOARD:
            return <Dashboard user={user} setView={setView} transactions={transactions} />;
        case AppView.LIBRARY:
            return <Library user={user} books={books} transactions={transactions} onBorrow={handleBorrowBook} onReturn={handleReturnBook} />;
        case AppView.SPIN_WHEEL:
            return <SpinWheel user={user} onSpinEnd={handleSpinTransaction} />;
        case AppView.QUIZ:
            return <QuizZone user={user} onQuizComplete={handleTransaction} />;
        case AppView.LEDGER:
            return <LedgerView user={facultyImpersonator || user} transactions={transactions} />;
        case AppView.STUDENT_MANAGEMENT:
            return <StudentManagement 
                        students={allStudents}
                        onAddStudent={handleAddStudent}
                        onAddStudentsBulk={handleAddStudentsBulk}
                        onEditStudent={handleEditStudent}
                        onRemoveStudent={handleRemoveStudent}
                        onViewProfile={handleViewProfile}
                        onActAs={handleActAsStudent}
                    />;
        case AppView.STUDENT_PROFILE:
            if (selectedStudent) {
                return <StudentProfile 
                            student={selectedStudent}
                            allTransactions={transactions}
                            allBooks={books}
                            onBack={() => setView(AppView.STUDENT_MANAGEMENT)}
                        />
            }
            setView(AppView.STUDENT_MANAGEMENT);
            return null;
        case AppView.COMMUNITY:
            return <Community 
                        students={allStudents.filter(s => s.id !== user.id)}
                        onViewProfile={handleViewPublicProfile} 
                    />;
        case AppView.PUBLIC_PROFILE:
            if (selectedStudent) {
                return <PublicStudentProfile 
                            student={selectedStudent}
                            onBack={() => setView(AppView.COMMUNITY)}
                        />
            }
            setView(AppView.COMMUNITY);
            return null;
        case AppView.JOIN_FACULTY:
            return <JoinFaculty
                        onJoin={handleJoinFaculty}
                        onBack={() => setView(AppView.DASHBOARD)}
                        existingFacultyEmails={allFaculty.map(f => f.email)}
                    />;
        case AppView.ACTIVITY_FEED:
            return <ActivityFeed
                        user={user}
                        activities={activities}
                        onSubmit={handleActivitySubmit}
                        onVerify={handleVerifyActivity}
                    />;
        default:
            return <Dashboard user={user} setView={setView} transactions={transactions} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <Header user={user} onToggleUser={handleToggleUser} setView={setView} facultyImpersonator={facultyImpersonator} onStopImpersonating={handleStopImpersonating} />
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 bg-slate-800/50 p-4 border-r border-slate-700 flex flex-col">
          <div className="mb-8">
              <h2 className="text-lg font-semibold text-white px-3">Menu</h2>
          </div>
          <div className="space-y-2">
              <NavItem icon={<DashboardIcon className="w-5 h-5"/>} label="Dashboard" targetView={AppView.DASHBOARD} />
              <NavItem icon={<ActivityFeedIcon className="w-5 h-5"/>} label="Activity Feed" targetView={AppView.ACTIVITY_FEED} />
              <NavItem icon={<CommunityIcon className="w-5 h-5"/>} label="Community" targetView={AppView.COMMUNITY} isStudentOnly />
              <NavItem icon={<LibraryIcon className="w-5 h-5"/>} label="Library" targetView={AppView.LIBRARY} />
              <NavItem icon={<QuizIcon className="w-5 h-5"/>} label="Quiz Zone" targetView={AppView.QUIZ} isStudentOnly/>
              <NavItem icon={<SpinWheelIcon className="w-5 h-5"/>} label="Bonus Wheel" targetView={AppView.SPIN_WHEEL} isStudentOnly />
              <NavItem icon={<LedgerIcon className="w-5 h-5"/>} label="Ledger" targetView={AppView.LEDGER} />
              <NavItem icon={<UserManagementIcon className="w-5 h-5"/>} label="Students" targetView={AppView.STUDENT_MANAGEMENT} isFacultyOnly />
          </div>
        </nav>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">
              {renderView()}
          </main>
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default App;
