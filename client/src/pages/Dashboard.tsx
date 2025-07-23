import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../hooks/useData';

import Header from '../components/layout/Header';
import AiInsightCard from '../components/shared/AiInsightCard';
import SpendingChart from '../components/charts/SpendingChart';
import StatCard from '../components/shared/StatCard';
import AddTransactionModal from '../components/forms/AddTransactionModal';
import SetBudgetModal from '../components/forms/SetBudgetModal';
import { TransactionList } from '../components/shared/TransactionList';
import { CommandMenu } from '../components/shared/CommandMenu'; // <-- ✅ NEW
import { Skeleton } from '../components/shared/Skeleton'; // <-- ✅ NEW
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  Plus,
  Loader2,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const { stats, goal, loading, transactions } = useData();

  useEffect(() => {
    if (!loading && !goal) {
      setIsBudgetModalOpen(true);
    }
  }, [loading, goal]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

if (loading) {
    // This is the skeleton loader UI
    return (
        <div className="w-full min-h-screen bg-background p-6 md:p-8">
            <div className="max-w-screen-xl mx-auto">
                <Skeleton className="h-12 w-1/3 mb-8" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Skeleton className="h-[400px] lg:col-span-2" />
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        </div>
    );
}

  return (
    <>
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
      <CommandMenu onAddTransaction={() => setIsAddModalOpen(true)} /> {/* ✅ */}

      <div className="w-full min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-screen-xl mx-auto">
          <Header />
          <motion.main
            className="flex flex-1 flex-col gap-4 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-primary/20 text-primary py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Plus size={20} />
                Add Transaction
              </button>
            </motion.div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              variants={itemVariants}
            >
              <StatCard
                title="Total Balance"
                value={formatCurrency(stats.balance)}
                icon={Wallet}
              />
              <StatCard
                title="Total Income"
                value={formatCurrency(stats.income)}
                icon={TrendingUp}
                color="text-green-400"
              />
              <StatCard
                title="Total Expenses"
                value={formatCurrency(stats.expense)}
                icon={TrendingDown}
                color="text-red-400"
              />
              <StatCard
                title="Monthly Budget"
                value={formatCurrency(goal?.monthlyBudget || 0)}
                icon={Target}
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 lg:grid-cols-3"
              variants={itemVariants}
            >
              <div className="lg:col-span-2">
                <SpendingChart transactions={transactions} />
              </div>
              <motion.div variants={itemVariants}>
                <AiInsightCard />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TransactionList transactions={transactions.slice(0, 5)} />
            </motion.div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
