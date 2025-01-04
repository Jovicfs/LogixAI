import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';

function SmartEdit() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editType, setEditType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const editTypes = [
    'Background Removal',
    'Color Enhancement',
    'Style Transfer',
    'Resolution Upscaling',
    'Object Removal',
    'Image Restoration'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/smart_edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ 
          image: image,
          editType: editType 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setEditedImage(data.edited_image);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to edit image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={localStorage.getItem('username')}
      />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Smart Edit</h1>
            <p className="text-gray-600 mt-2">Enhance and transform your images with AI</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Edit Type
              </label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an edit type</option>
                {editTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={handleEdit}
              disabled={isLoading || !image || !editType}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Processing...' : 'Edit Image'}
            </motion.button>
          </div>

          {/* Image Preview */}
          {(image || editedImage) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {image && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-medium mb-2">Original</h3>
                  <img
                    src={image}
                    alt="Original"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </motion.div>
              )}
              {editedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-medium mb-2">Edited</h3>
                  <img
                    src={editedImage}
                    alt="Edited"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                  <motion.button
                    onClick={() => window.open(editedImage, '_blank')}
                    className="mt-4 bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download Edited Image
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default SmartEdit;
