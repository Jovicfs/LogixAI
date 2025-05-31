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
            boxShadow: theme.shadows[6],
            color: theme.palette.text.primary,
            borderRadius: 24,
            border: `1.5px solid ${theme.palette.divider}`,
          }}
          className="w-full max-w-3xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div
            className="p-6 border-b flex justify-between items-center"
            style={{
              borderColor: theme.palette.divider,
              background: theme.palette.background.paper,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="28" stroke="#3B82F6" strokeWidth="2" fill="#E0F2FE" />
                <circle cx="30" cy="15" r="3" fill="#3B82F6" />
                <circle cx="45" cy="25" r="3" fill="#3B82F6" />
                <circle cx="30" cy="45" r="3" fill="#3B82F6" />
                <circle cx="15" cy="25" r="3" fill="#3B82F6" />
                <circle cx="30" cy="30" r="3.5" fill="#1D4ED8" />
                <line x1="30" y1="15" x2="45" y2="25" stroke="#3B82F6" strokeWidth="1" />
                <line x1="30" y1="15" x2="15" y2="25" stroke="#3B82F6" strokeWidth="1" />
                <line x1="30" y1="15" x2="30" y2="30" stroke="#3B82F6" strokeWidth="1" />
                <line x1="45" y1="25" x2="30" y2="30" stroke="#3B82F6" strokeWidth="1" />
                <line x1="15" y1="25" x2="30" y2="30" stroke="#3B82F6" strokeWidth="1" />
                <line x1="30" y1="30" x2="30" y2="45" stroke="#3B82F6" strokeWidth="1" />
              </svg>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors hover:bg-blue-50"
              style={{ background: theme.palette.action?.hover || theme.palette.background.default }}
            >
              <FiX className="w-7 h-7" style={{ color: theme.palette.text.secondary }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(85vh-8rem)] bg-gradient-to-br from-blue-50/60 to-white">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <svg width="48" height="48" fill="none" className="mx-auto mb-4">
                  <circle cx="24" cy="24" r="22" stroke="#3B82F6" strokeWidth="2" fill="#E0F2FE" />
                  <text x="24" y="30" textAnchor="middle" fontSize="20" fill="#3B82F6">?</text>
                </svg>
                <p className="text-lg" style={{ color: theme.palette.text.secondary }}>Nenhum item salvo ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    whileHover={{ scale: 1.025, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.10)" }}
                    className="flex items-center justify-between p-5 rounded-xl bg-white shadow transition-all border"
                    style={{
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      {itemRenderer ? itemRenderer(item) : (
                        <span className="font-medium text-lg truncate">{item.name || 'Item'}</span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onDownload(item)}
                        className="p-2 rounded-full hover:bg-blue-100 transition"
                        style={{ color: theme.palette.primary.main }}
                        title="Baixar"
                      >
                        <FiDownload size={22} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-full hover:bg-red-100 transition"
                        style={{ color: theme.palette.error.main }}
                        title="Excluir"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StorageModal;
