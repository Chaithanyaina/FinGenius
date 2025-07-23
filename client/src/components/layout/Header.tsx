import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, UserCircle, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationPanel from '../shared/NotificationPanel';
import ProfileDropdown from '../shared/ProfileDropdown';

const Header = () => {
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <motion.header 
      className="flex items-center justify-between"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2">
         <Sparkles className="text-primary h-8 w-8" />
         <h1 className="text-2xl font-bold tracking-tighter text-foreground">FinGenius</h1>
      </div>
      <div className="flex items-center gap-6 relative">
        <div className="relative">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-foreground/80 hover:text-foreground transition-colors">
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
          <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
            <UserCircle size={32} />
            <span className="font-medium">{user?.username || 'User'}</span>
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;