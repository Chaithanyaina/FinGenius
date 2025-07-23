import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { User, Mail, Lock } from 'lucide-react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // FIX: Pass user data as a single object
      await registerUser({ username, email, password });
      // On successful registration, redirect to login page
      navigate('/login');
    } catch (err: any) {
      // FIX: Display specific error message from backend
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sign up. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        className="w-full max-w-md glass-card p-8 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter">Create Account</h1>
          <p className="text-foreground/60">Start your financial journey today</p>
        </div>

        {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-foreground/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;