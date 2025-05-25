import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiTrash2, FiX } from 'react-icons/fi';
import { useTheme } from '@mui/material/styles';

const StorageModal = ({ 
  items, 
  isOpen, 
  onClose, 
  onDownload, 
  onDelete, 
  title = "Saved Items",
  itemRenderer
}) => {
  const theme = useTheme();
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: theme.palette.action?.backdrop || 'rgba(0,0,0,0.5)' }}
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{ 
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            color: theme.palette.text.primary,
          }}
          className="rounded-2xl w-11/12 max-w-5xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div
            className="p-6 border-b flex justify-between items-center"
            style={{ borderColor: theme.palette.divider, background: theme.palette.background.paper }}
          >
            <h2
              className="text-2xl font-bold"
              style={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ background: theme.palette.action?.hover || theme.palette.background.default }}
            >
              <FiX className="w-6 h-6" style={{ color: theme.palette.text.secondary }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]" style={{ background: theme.palette.background.paper }}>
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: theme.palette.text.secondary }}>No items saved yet</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between mb-4 p-4 rounded-lg"
                  style={{
                    background: theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary
                  }}
                >
                  {itemRenderer ? itemRenderer(item) : <span>{item.name || 'Item'}</span>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDownload(item)}
                      className="p-2 rounded hover:opacity-80"
                      style={{ background: theme.palette.success.light, color: theme.palette.success.dark }}
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-2 rounded hover:opacity-80"
                      style={{ background: theme.palette.error.light, color: theme.palette.error.dark }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StorageModal;
