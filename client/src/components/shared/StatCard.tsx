import { motion } from 'framer-motion';
import { type LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  
  return (
    <motion.div className="glass-card p-6 flex flex-col justify-between" variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground/80">{title}</span>
        <Icon className={cn("h-6 w-6 text-foreground/60", color)} />
      </div>
      
      {/* --- THIS IS THE FIX --- */}
      {/* We add 'truncate' to add an ellipsis (...) if the text overflows */}
      {/* We also add 'tracking-tight' for better spacing on large numbers */}
      <p 
        className="text-3xl font-bold tracking-tight truncate"
        title={value} // Adding a tooltip to show the full number on hover
      >
        {value}
      </p>
    </motion.div>
  );
};

export default StatCard;