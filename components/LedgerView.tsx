
import React from 'react';
import { Transaction, User } from '../types';

interface LedgerViewProps {
  transactions: readonly Transaction[];
  user: User;
}

const getTransactionRowStyle = (type: string) => {
    if(type.startsWith('EARN')) return 'bg-green-500/10 text-green-300';
    if(type.startsWith('SPEND')) return 'bg-red-500/10 text-red-300';
    return 'bg-blue-500/10 text-blue-300';
}

const LedgerView: React.FC<LedgerViewProps> = ({ transactions, user }) => {
  const filteredTransactions = user.role === 'Faculty' ? transactions : transactions.filter(t => t.userId === user.id);

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Transaction Ledger</h1>
      <p className="text-slate-400 mb-6">
        {user.role === 'Faculty' ? 'Showing all transactions in the system.' : 'Showing all of your transactions.'}
      </p>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 max-h-[70vh] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800 z-10">
            <tr>
              <th className="p-4">Txn ID</th>
              <th className="p-4">Timestamp</th>
              {user.role === 'Faculty' && <th className="p-4">User ID</th>}
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
                <tr><td colSpan={user.role === 'Faculty' ? 6 : 5} className="text-center p-8 text-slate-500">No transactions found.</td></tr>
            ) : (
                filteredTransactions.map(tx => (
                    <tr key={tx.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="p-4 text-slate-500 font-mono text-sm">{tx.id}</td>
                        <td className="p-4 text-slate-400">{tx.timestamp.toLocaleString()}</td>
                        {user.role === 'Faculty' && <td className="p-4">{tx.userId}</td>}
                        <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTransactionRowStyle(tx.type)}`}>
                                {tx.type}
                            </span>
                        </td>
                        <td className={`p-4 font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="p-4">{tx.description}</td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerView;
