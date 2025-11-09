
import { Transaction, TransactionType } from '../types';

class BlockchainService {
  private static instance: BlockchainService;
  private ledger: Transaction[] = [];
  private transactionCounter = 0;

  private constructor() {
    // Initial dummy transactions for demonstration
    this.addTransaction({
      userId: 'user-001',
      type: TransactionType.EARN_ACADEMIC,
      amount: 100,
      description: 'Completed "Intro to Blockchain" assignment.',
    });
    this.addTransaction({
      userId: 'user-002',
      type: TransactionType.EARN_PEER_LEARNING,
      amount: 25,
      description: 'Mentored a junior student.',
    });
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  public addTransaction(data: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    this.transactionCounter++;
    const newTransaction: Transaction = {
      id: `txn-${this.transactionCounter.toString().padStart(5, '0')}`,
      timestamp: new Date(),
      ...data,
    };
    this.ledger.push(newTransaction);
    console.log('New transaction added to ledger:', newTransaction);
    return newTransaction;
  }

  public getLedger(): readonly Transaction[] {
    // Return a copy to maintain immutability
    return [...this.ledger].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const blockchainService = BlockchainService.getInstance();
