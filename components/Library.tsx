import React, { useState } from 'react';
import { Book, BookStatus, User, UserRole, TransactionType, Transaction } from '../types';

interface LibraryProps {
  user: User;
  books: Book[];
  transactions: readonly Transaction[];
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
}

const Library: React.FC<LibraryProps> = ({ user, books, transactions, onBorrow, onReturn }) => {
  const [error, setError] = useState<string | null>(null);

  const handleBorrow = (book: Book) => {
    setError(null);
    if (user.role !== UserRole.Student) {
        setError("Only students can borrow books.");
        setTimeout(() => setError(null), 3000);
        return;
    }

    if (user.credits < book.cost) {
      setError("Not enough Time Credits to borrow this book.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    onBorrow(book);
  };

  const libraryTransactions = transactions.filter(t => t.type === TransactionType.SPEND_LIBRARY || t.type === TransactionType.RETURN_LIBRARY);

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Library</h1>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-6">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{book.title}</h2>
              <p className="text-slate-400 mb-4">by {book.author}</p>
              <p className={`text-sm font-semibold mb-1 ${book.status === BookStatus.Available ? 'text-green-400' : 'text-yellow-400'}`}>
                Status: {book.status}
              </p>
              {book.status === BookStatus.Borrowed && <p className="text-xs text-slate-500 mb-4">Borrowed by User ID: {book.borrowedBy}</p>}
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-yellow-400">{book.cost} TC</span>
              {book.status === BookStatus.Available ? (
                <button
                  onClick={() => handleBorrow(book)}
                  disabled={user.role !== UserRole.Student}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Borrow
                </button>
              ) : (
                (book.borrowedBy === user.id || user.role === UserRole.Faculty) && (
                  <button
                    onClick={() => onReturn(book)}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                  >
                    Return
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {user.role === UserRole.Faculty && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Library Transaction Log</h2>
            <div className="bg-slate-800 rounded-lg border border-slate-700 max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-800">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libraryTransactions.map(tx => (
                            <tr key={tx.id} className="border-t border-slate-700">
                                <td className="p-4 text-slate-400">{tx.timestamp.toLocaleString()}</td>
                                <td className="p-4">{tx.userId}</td>
                                <td className={`p-4 font-semibold ${tx.type === TransactionType.SPEND_LIBRARY ? 'text-red-400' : 'text-green-400'}`}>
                                    {tx.type === TransactionType.SPEND_LIBRARY ? 'Borrow' : 'Return'}
                                </td>
                                <td className="p-4">{tx.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Library;