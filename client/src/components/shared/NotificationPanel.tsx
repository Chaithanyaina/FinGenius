import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications } from '../../services/api';
import { Loader2, BellRing } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: number;
    message: string;
    date: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch notifications only when the panel is opened and empty
        if (isOpen && notifications.length === 0) {
            setLoading(true);
            getNotifications()
                .then(data => setNotifications(data))
                .catch(err => console.error("Failed to fetch notifications", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-80 max-w-sm glass-card rounded-lg shadow-lg z-20"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h4 className="font-semibold">Notifications</h4>
            <button 
                onClick={() => setNotifications([])} // Clear notifications to allow refetching
                className="text-xs text-primary/80 hover:text-primary"
            >
                Refresh
            </button>
          </div>
          <div className="p-2 max-h-80 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : notifications.length > 0 ? (
                <ul className="space-y-2">
                    {notifications.map((notif) => (
                        <li key={notif.id} className="flex gap-3 p-2 rounded-md hover:bg-white/5">
                            <BellRing className="h-5 w-5 mt-1 text-primary/80 shrink-0"/>
                            <div>
                                <p className="text-sm text-foreground">{notif.message}</p>
                                <p className="text-xs text-foreground/60">{formatDistanceToNow(new Date(notif.date), { addSuffix: true })}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-foreground/60 py-4">
                    <p>No new notifications</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;