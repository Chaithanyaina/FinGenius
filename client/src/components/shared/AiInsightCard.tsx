import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { getAiInsights } from '../../services/api';

const AiInsightCard = () => {
  const [insights, setInsights] = useState([
    "Click 'Get General Insights' or ask a specific question below.",
  ]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generic function to handle API calls
  const fetchInsights = async (userQuestion: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getAiInsights(userQuestion);
      const formattedInsights = data.insights.split('\n').filter(Boolean);
      setInsights(formattedInsights);
      setQuestion(''); // Clear the input field after asking
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Could not fetch AI insights.';
      setError(errorMessage);
      setInsights([]); // Clear previous insights on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the default button
  const handleGetGeneralInsights = () => {
    fetchInsights(''); // Pass an empty string for general insights
  };

  // Handler for the specific question
  const handleAskSpecificQuestion = () => {
    if (!question.trim()) return;
    fetchInsights(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAskSpecificQuestion();
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 h-full flex flex-col"
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-400" />
        <h3 className="text-lg font-semibold">AI Financial Insights 🤖</h3>
      </div>
      <div className="flex-grow space-y-3 text-foreground/80 mb-4 min-h-[120px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          insights.map((insight, index) => <p key={index}>{insight}</p>)
        )}
        {error && <p className="text-red-400">{error}</p>}
      </div>

      <div className="mt-auto space-y-3">
        {/* The "Get General Insights" button */}
        <button
            onClick={handleGetGeneralInsights}
            disabled={isLoading}
            className="w-full bg-primary/10 text-primary py-2 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
            Get General Insights
        </button>

        {/* The specific question input */}
        <div className="flex items-center gap-2">
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Or ask a specific question..."
                className="w-full p-2 bg-background/50 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={1}
            />
            <button 
                onClick={handleAskSpecificQuestion}
                disabled={isLoading || !question.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                aria-label="Ask AI"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AiInsightCard;