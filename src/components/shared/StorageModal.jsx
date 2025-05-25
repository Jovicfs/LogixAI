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
        style={{ background: theme.palette.action.backdrop }}
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{ 
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[4]
          }}
          className="rounded-2xl w-11/12 max-w-5xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No items saved yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="aspect-video bg-white p-4 flex items-center justify-center">
                      {itemRenderer ? (
                        itemRenderer(item)
                      ) : (
                        <img
                          src={item.image_url}
                          alt={item.title || 'Generated item'}
                          className="max-h-full w-auto object-contain"
                        />
                      )}
                    </div>
                    
                    <div className="p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDownload(item)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" />
                            <span>Download</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDelete(item.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </motion.button>
                        </div>
                      </div>
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
