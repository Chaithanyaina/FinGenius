import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/api';
import { Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { user, token } = await loginUser({ email, password });
      auth.login(user, token);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        className="w-full max-w-md glass-card p-8 space-y-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="text-primary" size={32} />
            <h1 className="text-4xl font-bold tracking-tighter">FinGenius</h1>
          </div>
          <p className="text-foreground/60">Your AI-Powered Financial Co-Pilot</p>
        </div>

        {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-foreground/60">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;