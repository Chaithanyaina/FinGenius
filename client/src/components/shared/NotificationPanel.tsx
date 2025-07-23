import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-80 glass-card rounded-lg shadow-lg z-20"
          onClick={onClose}
        >
          <div className="p-4">
            <h4 className="font-semibold mb-2">Notifications</h4>
            <div className="text-center text-foreground/60 py-4">
              <p>No new notifications</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;