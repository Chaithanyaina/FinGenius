import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { addTransaction } from '../../services/api';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { useData } from '../../hooks/useData';
import toast from 'react-hot-toast';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const { addTransactionToState } = useData();

  const getInitialState = () => ({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    date: new Date(),
    description: '',
  });

  const [formState, setFormState] = useState(getInitialState());
  const [error, setError] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const resetForm = () => {
    setFormState(getInitialState());
    setError('');
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        resetForm();
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formState.amount || !formState.category || !formState.date) {
      setError('Amount, Category, and Date are required.');
      return;
    }

    const promise = addTransaction({
      ...formState,
      amount: parseFloat(formState.amount),
      date: formState.date.toISOString(),
    });

    toast.promise(promise, {
      loading: 'Adding transaction...',
      success: (newTransaction) => {
        addTransactionToState(newTransaction);
        onClose();
        return 'Transaction added!';
      },
      error: (err) => err.response?.data?.message || 'Failed to add transaction.'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            <button onClick={onClose} className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6">Add New Transaction</h2>

            {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFormState(s => ({ ...s, type: 'expense' }))} className={`py-2 rounded-md transition-all duration-300 ${formState.type === 'expense' ? 'bg-red-500/80 text-white font-semibold ring-2 ring-red-400' : 'bg-white/10'}`}>Expense</button>
                  <button type="button" onClick={() => setFormState(s => ({ ...s, type: 'income' }))} className={`py-2 rounded-md transition-all duration-300 ${formState.type === 'income' ? 'bg-green-500/80 text-white font-semibold ring-2 ring-green-400' : 'bg-white/10'}`}>Income</button>
                </div>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground/80 mb-1">Amount</label>
                <input id="amount" name="amount" type="number" value={formState.amount} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 bg-background/50 border border-white/10 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground/80 mb-1">Category</label>
                <input id="category" name="category" type="text" value={formState.category} onChange={handleInputChange} placeholder="e.g., Food, Salary" className="w-full p-2 bg-background/50 border border-white/10 rounded-lg" required />
              </div>
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium text-foreground/80 mb-1">Date</label>
                <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="w-full p-2 text-left bg-background/50 border border-white/10 rounded-lg flex justify-between items-center">
                  <span>{formState.date ? format(formState.date, 'PPP') : 'Select a date'}</span>
                  <CalendarIcon className="h-4 w-4" />
                </button>
                {isCalendarOpen && (
                  <div className="absolute z-10 bottom-full mb-2 right-0">
                    <DayPicker
                      mode="single"
                      selected={formState.date}
                      onSelect={(d) => {
                        if (d) {
                          setFormState(s => ({ ...s, date: d }));
                        }
                        setIsCalendarOpen(false); // ✅ Closes calendar after date selection
                      }}
                      className="bg-card border border-white/10 rounded-md p-2"
                      classNames={{
                        head_cell: 'text-foreground/60 w-9 font-normal text-sm',
                        cell: 'w-9 h-9 text-sm p-0',
                        day: 'w-9 h-9 hover:bg-white/10 rounded-md',
                        day_selected: 'bg-primary text-primary-foreground rounded-md',
                        day_today: 'text-primary font-bold',
                        nav_button: 'h-9 w-9 hover:bg-white/10 rounded-md',
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-1">Description (Optional)</label>
                <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} placeholder="e.g., Dinner with friends" className="w-full p-2 bg-background/50 border border-white/10 rounded-lg h-20"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                Add Transaction
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;
