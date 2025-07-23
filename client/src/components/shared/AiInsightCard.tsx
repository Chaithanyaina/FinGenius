import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { getAiInsights } from '../../services/api';

const AiInsightCard = () => {
  const [insights, setInsights] = useState([
    "💡 Your spending is well-balanced this month. Keep it up!",
    "📈 Click 'Get New Insights' to analyze your latest transactions with AI.",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchInsights = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAiInsights();
      // The backend returns a single string with insights separated by newlines
      const formattedInsights = data.insights.split('\n').filter(Boolean);
      setInsights(formattedInsights);
    } catch (err) {
      setError('Could not fetch AI insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 h-full flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-400" />
        <h3 className="text-lg font-semibold">AI Financial Insights</h3>
      </div>
      <div className="flex-grow space-y-3 text-foreground/80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          insights.map((insight, index) => <p key={index}>{insight}</p>)
        )}
        {error && <p className="text-red-400">{error}</p>}
      </div>
      <button 
        onClick={handleFetchInsights}
        disabled={isLoading}
        className="mt-4 w-full bg-primary/10 text-primary py-2 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? 'Analyzing...' : 'Get New Insights'}
      </button>
    </motion.div>
  );
};

export default AiInsightCard;