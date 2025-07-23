import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const { logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-48 glass-card rounded-lg shadow-lg z-20"
          onClick={onClose}
        >
          <ul className="p-2">
            <li>
              <Link to="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10">
                <User size={16} /> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10">
                <Settings size={16} /> Settings
              </Link>
            </li>
            <li>
              <button onClick={logout} className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-white/10 text-red-400">
                <LogOut size={16} /> Logout
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;