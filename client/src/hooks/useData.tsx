import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import {
  getTransactions,
  getGoal,
  deleteTransaction as apiDeleteTransaction,
} from '../services/api';
import { useAuth } from './useAuth';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface Stats {
  balance: number;
  income: number;
  expense: number;
}

interface Goal {
  _id: string;
  monthlyBudget: number;
}

interface DataContextType {
  transactions: Transaction[];
  stats: Stats;
  goal: Goal | null;
  loading: boolean;
  addTransactionToState: (transaction: Transaction) => void;
  updateTransactionInState: (id: string, updatedTransaction: Transaction) => void;
  removeTransactionFromState: (id: string) => Promise<void>;
  fetchData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateStats = (trans: Transaction[]) => {
    const income = trans
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = trans
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    setStats({ balance, income, expense });
  };

  const fetchData = useCallback(async () => {
    if (!loading) setLoading(true);
    try {
      const [transData, goalData] = await Promise.all([
        getTransactions(),
        getGoal(),
      ]);
      setTransactions(transData);
      calculateStats(transData);
      setGoal(goalData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const addTransactionToState = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(newTransactions);
    calculateStats(newTransactions);
  };

  const updateTransactionInState = (id: string, updated: Transaction) => {
    const updatedTransactions = transactions
      .map((t) => (t._id === id ? updated : t))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(updatedTransactions);
    calculateStats(updatedTransactions);
  };

  const removeTransactionFromState = async (id: string) => {
    await apiDeleteTransaction(id);
    const updatedTransactions = transactions.filter((t) => t._id !== id);
    setTransactions(updatedTransactions);
    calculateStats(updatedTransactions);
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        stats,
        goal,
        loading,
        addTransactionToState,
        updateTransactionInState,
        removeTransactionFromState,
        fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
