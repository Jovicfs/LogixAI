import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 left-4 z-50 p-4 rounded-lg shadow-lg 
          ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
          text-white min-w-[200px]`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-4 hover:opacity-75">×</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
