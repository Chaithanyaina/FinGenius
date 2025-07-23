import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { updateTransaction } from '../../services/api';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { useData } from '../../hooks/useData';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const EditTransactionModal = ({ isOpen, transaction, onClose }: EditTransactionModalProps) => {
  const { updateTransactionInState } = useData();
  const [formState, setFormState] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount ? transaction.amount.toString() : '',
    category: transaction?.category || '',
    date: transaction ? new Date(transaction.date) : new Date(),
    description: transaction?.description || '',
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormState({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: new Date(transaction.date),
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    const promise = updateTransaction(transaction._id, {
      ...formState,
      amount: parseFloat(formState.amount),
      date: formState.date.toISOString(),
    });

    toast.promise(promise, {
      loading: 'Updating transaction...',
      success: (updatedTransaction) => {
        updateTransactionInState(updatedTransaction._id, updatedTransaction);
        onClose();
        return 'Transaction updated!';
      },
      error: (err) => err.response?.data?.message || 'Failed to update transaction.',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card w-full max-w-lg p-6 rounded-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Transaction</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormState(s => ({ ...s, type: 'expense' }))}
                    className={`py-2 rounded-md transition-all duration-300 ${formState.type === 'expense'
                      ? 'bg-red-500/80 text-white font-semibold ring-2 ring-red-400'
                      : 'bg-white/10'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormState(s => ({ ...s, type: 'income' }))}
                    className={`py-2 rounded-md transition-all duration-300 ${formState.type === 'income'
                      ? 'bg-green-500/80 text-white font-semibold ring-2 ring-green-400'
                      : 'bg-white/10'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground/80 mb-1">
                  Amount
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formState.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-background/50 border border-white/10 rounded-lg"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground/80 mb-1">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formState.category}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-background/50 border border-white/10 rounded-lg"
                  required
                />
              </div>

              {/* Date */}
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium text-foreground/80 mb-1">
                  Date
                </label>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full p-2 text-left bg-background/50 border border-white/10 rounded-lg flex justify-between items-center"
                >
                  <span>{formState.date ? format(formState.date, 'PPP') : 'Select a date'}</span>
                  <CalendarIcon className="h-4 w-4" />
                </button>
                {isCalendarOpen && (
                  <div className="absolute z-10 bottom-full mb-2 right-0">
                    <DayPicker
                      mode="single"
                      selected={formState.date}
                      onSelect={(d) => {
                        if (d) setFormState(s => ({ ...s, date: d }));
                        setIsCalendarOpen(false);
                      }}
                      className="bg-card border border-white/10 rounded-md p-2"
                      classNames={{
                        caption: 'flex justify-center items-center py-2 text-sm font-medium',
                        nav: 'flex items-center gap-1',
                        nav_button: 'rounded-md p-1 hover:bg-muted text-foreground/80',
                        table: 'w-full border-collapse mt-2',
                        head_row: 'flex justify-around text-foreground/60 text-xs',
                        row: 'flex justify-around text-sm',
                        cell: 'rounded-md p-1 hover:bg-muted transition-colors',
                        day: 'w-9 h-9 flex items-center justify-center',
                        day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
                        day_today: 'border border-primary text-primary',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-background/50 border border-white/10 rounded-lg h-20"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formState.amount || !formState.category || !formState.date}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditTransactionModal;
