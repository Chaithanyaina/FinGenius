import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/api';

const Settings = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
        const profileData: { username: string; email: string; password?: string } = {
            username,
            email,
        };
        if (password) {
            profileData.password = password;
        }

      const { id, token } = await updateUserProfile(profileData);
      // We get a new user object and potentially a new token if password changes, so we re-login
      login({ id, username, email }, token || localStorage.getItem('token')!);
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <Header />
        <main className="flex-1 py-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-foreground/60 mb-6">Update your profile information.</p>
          
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 bg-background/50 border border-white/10 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 bg-background/50 border border-white/10 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">New Password (optional)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" className="w-full p-2 bg-background/50 border border-white/10 rounded-lg" />
              </div>
              <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            {message && <p className="mt-4 text-center text-green-400">{message}</p>}
          </div>

          <Link to="/" className="text-primary hover:underline mt-6 inline-block">
              &larr; Back to Dashboard
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Settings;