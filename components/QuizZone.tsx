import React, { useState, useEffect, useRef } from 'react';
import { QuizCategory, QuizQuestion, User, UserRole, LeaderboardEntry, TransactionType } from '../types';
import { QUIZ_CATEGORIES, LEADERBOARD_DATA, QUIZ_TIME_LIMIT, QUIZ_BONUS_REWARD } from '../constants';

interface QuizZoneProps {
  user: User;
  onQuizComplete: (amount: number, type: TransactionType, description: string) => void;
}

const QuizZone: React.FC<QuizZoneProps> = ({ user, onQuizComplete }) => {
  const [categories, setCategories] = useState<QuizCategory[]>(QUIZ_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  
  const [finalCorrectCount, setFinalCorrectCount] = useState(0);
  const [totalCreditsWon, setTotalCreditsWon] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);
  // FIX: Replaced NodeJS.Timeout with `number` for browser compatibility, as setInterval returns a number in the browser.
  const timerRef = useRef<number | null>(null);

  const [newQuestion, setNewQuestion] = useState({ category: '', question: '', options: '', correctAnswer: '', credits: '10' });

  // Timer countdown effect
  useEffect(() => {
    if (activeCategory && !isQuizFinished) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCategory, isQuizFinished]);

  // Auto-submit effect when timer runs out
  useEffect(() => {
    if (timeLeft <= 0 && activeCategory && !isQuizFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleSubmitQuiz(true); // true indicates auto-submission
    }
  }, [timeLeft, activeCategory, isQuizFinished]);

  const handleCategorySelect = (category: QuizCategory) => {
    setActiveCategory(category);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(category.questions.length).fill(null));
    setIsQuizFinished(false);
    setFinalCorrectCount(0);
    setTotalCreditsWon(0);
    setTimeLeft(QUIZ_TIME_LIMIT);
    setWasAutoSubmitted(false);
  };

  const handleSelectAnswer = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeCategory!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = (autoSubmitted = false) => {
    if (isQuizFinished) return; // Prevent re-submission

    if (timerRef.current) clearInterval(timerRef.current);
    setWasAutoSubmitted(autoSubmitted);

    let correctCount = 0;
    let fullReward = 0;
    activeCategory!.questions.forEach((q, index) => {
      if (q.correctAnswer === userAnswers[index]) {
        correctCount++;
        fullReward += q.credits;
      }
    });

    setFinalCorrectCount(correctCount);
    
    let earnedCredits = 0;
    let description = '';

    if (correctCount === activeCategory!.questions.length && correctCount > 0) {
      earnedCredits = fullReward;
      description = `Aced the "${activeCategory!.name}" quiz with a perfect score!`;
    } else if (correctCount >= 3) {
      earnedCredits = QUIZ_BONUS_REWARD;
      description = `Scored ${correctCount}/${activeCategory!.questions.length} on "${activeCategory!.name}" and earned a bonus.`;
    }
    
    setTotalCreditsWon(earnedCredits);
    if (earnedCredits > 0) {
      onQuizComplete(earnedCredits, TransactionType.EARN_QUIZ, description);
    }

    setIsQuizFinished(true);
  };

  const handleRestart = () => {
    setActiveCategory(null);
  };
  
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: QuizQuestion = {
        question: newQuestion.question,
        options: newQuestion.options.split(',').map(s => s.trim()),
        correctAnswer: newQuestion.correctAnswer,
        credits: parseInt(newQuestion.credits, 10),
    };
    setCategories(prev => {
        const catIndex = prev.findIndex(c => c.name === newQuestion.category);
        if (catIndex > -1) {
            const updatedCategories = [...prev];
            updatedCategories[catIndex].questions.push(newQ);
            return updatedCategories;
        } else {
            return [...prev, { name: newQuestion.category, questions: [newQ] }];
        }
    });
    setNewQuestion({ category: '', question: '', options: '', correctAnswer: '', credits: '10' });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isQuizFinished) {
    const allQuestionsCount = activeCategory?.questions.length || 0;
    return (
      <div className="p-8 animate-fade-in flex flex-col items-center">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-2 text-center">Quiz Results</h1>
          {wasAutoSubmitted && <p className="text-center text-yellow-400 font-semibold mb-4">⚠️ Time’s up! The quiz was auto-submitted.</p>}
          <div className="text-center mb-6">
            <p className="text-xl">You answered <span className="font-bold text-white">{finalCorrectCount}</span> out of <span className="font-bold text-white">{allQuestionsCount}</span> questions correctly.</p>
            <p className="text-2xl font-bold mt-2">You earned <span className="text-yellow-400">{totalCreditsWon}</span> Time Credits!</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto space-y-4 pr-4 border-t border-slate-700 pt-6">
            {activeCategory?.questions.map((q, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={index} className={`bg-slate-900/50 p-4 rounded-md border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <p className="font-semibold text-slate-300 mb-2">{index + 1}. {q.question}</p>
                  <div className="flex items-center gap-2 text-sm">
                    {isCorrect ? <span className="text-green-400 font-bold">✅ Your answer:</span> : <span className="text-red-400 font-bold">❌ Your answer:</span>}
                    <p className={isCorrect ? 'text-slate-300' : 'text-red-400 line-through'}>{userAnswer || 'Not answered'}</p>
                  </div>
                  {!isCorrect && <p className="text-sm mt-1 text-green-400"><span className="font-bold">Correct answer:</span> {q.correctAnswer}</p>}
                </div>
              );
            })}
          </div>

          <button onClick={handleRestart} className="mt-8 w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors">
            Choose Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (activeCategory) {
    const question = activeCategory.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === activeCategory.questions.length - 1;

    return (
      <div className="p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">{activeCategory.name}</h1>
            <div className={`px-4 py-2 rounded-full font-bold font-mono text-lg ${timeLeft < 60 ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
              {formatTime(timeLeft)}
            </div>
        </div>
        <p className="text-slate-400 mb-6">Question {currentQuestionIndex + 1} of {activeCategory.questions.length}</p>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map(option => (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 text-left rounded-md transition-all border-2 ${
                  userAnswers[currentQuestionIndex] === option 
                    ? 'bg-indigo-600 border-indigo-400' 
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 text-right">
          {isLastQuestion ? (
            <button 
              onClick={() => handleSubmitQuiz(false)}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              Finish & See Results
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Quiz Zone</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Category</h2>
           <div className="space-y-4">
            {categories.map(category => (
              <button 
                key={category.name} 
                onClick={() => handleCategorySelect(category)}
                disabled={user.role === UserRole.Faculty}
                className="w-full text-left p-6 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-slate-400">{category.questions.length} Questions</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
              {LEADERBOARD_DATA.map(entry => (
                  <div key={entry.rank} className="flex items-center gap-4 p-2 rounded-md hover:bg-slate-700/50">
                      <span className="font-bold text-lg text-slate-400 w-6 text-center">{entry.rank}</span>
                      <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full" />
                      <span className="font-semibold flex-grow">{entry.name}</span>
                      <span className="font-bold text-yellow-400">{entry.score} TC</span>
                  </div>
              ))}
          </div>
        </div>
      </div>
      
      {user.role === UserRole.Faculty && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Faculty: Add Quiz Question</h2>
            <form onSubmit={handleAddQuestion} className="bg-slate-800 p-6 rounded-lg border border-slate-700 space-y-4">
                <input type="text" placeholder="Category Name (e.g., General Science)" value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})} required className="w-full bg-slate-700 p-2 rounded-md"/>
                <input type="text" placeholder="Question" value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} required className="w-full bg-slate-700 p-2 rounded-md"/>
                <input type="text" placeholder="Options (comma-separated)" value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} required className="w-full bg-slate-700 p-2 rounded-md"/>
                <input type="text" placeholder="Correct Answer" value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} required className="w-full bg-slate-700 p-2 rounded-md"/>
                <input type="number" placeholder="Credits" value={newQuestion.credits} onChange={e => setNewQuestion({...newQuestion, credits: e.target.value})} required className="w-full bg-slate-700 p-2 rounded-md"/>
                <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold">Add Question</button>
            </form>
        </div>
      )}
    </div>
  );
};

export default QuizZone;
