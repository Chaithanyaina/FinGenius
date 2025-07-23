import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { format } from 'date-fns';
import EditTransactionModal from '../forms/EditTransactionModal';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const { removeTransactionFromState } = useData();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    removeTransactionFromState(transaction._id)
      .catch((err) => console.error('Failed to delete transaction', err));
    setShowConfirm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={transaction}
      />

      <motion.li
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-10 rounded-full ${
              transaction.type === 'income' ? 'bg-green-400' : 'bg-red-400'
            }`}
          ></div>
          <div>
            <p className="font-semibold capitalize">{transaction.category}</p>
            <p className="text-sm text-foreground/60">
              {transaction.description || 'No description'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p
              className={`font-bold ${
                transaction.type === 'income'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}{' '}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-foreground/60">
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </p>
          </div>

          {/* Edit & Delete */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-foreground/60 hover:text-primary transition-colors"
            >
              <Edit size={18} />
            </button>

            {showConfirm ? (
              <div className="flex gap-1 items-center text-sm">
                <button
                  onClick={handleDelete}
                  className="text-green-400 hover:text-green-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-red-400 hover:text-red-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-foreground/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.li>
    </>
  );
};

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map((t) => (
            <TransactionItem key={t._id} transaction={t} />
          ))}
        </ul>
      ) : (
        <p className="text-foreground/60 text-center py-4">
          No transactions yet. Click 'Add Transaction' to get started!
        </p>
      )}
    </div>
  );
};
