import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setGoal } from '../../services/api';
import { useData } from '../../hooks/useData';

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetBudgetModal = ({ isOpen, onClose }: SetBudgetModalProps) => {
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setGoal({ monthlyBudget: parseFloat(budget) });
      fetchData(); // Refetch data to get the new goal
      onClose();
    } catch (error) {
      console.error("Failed to set budget", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card w-full max-w-md p-8 rounded-xl text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Welcome to FinGenius!</h2>
            <p className="text-foreground/60 mb-6">Let's start by setting your monthly savings goal.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 50000" 
                className="w-full text-center text-2xl p-3 bg-background/50 border border-white/10 rounded-lg" 
                required 
              />
              <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Set Budget Goal'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetBudgetModal;