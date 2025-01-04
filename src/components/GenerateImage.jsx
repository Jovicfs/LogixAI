import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';

function GenerateImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const styles = [
    'Realistic', 'Artistic', 'Digital Art', 'Watercolor',
    'Oil Painting', '3D Render', 'Sketch', 'Anime'
  ];

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/generate_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedImage(data.image_url);
        loadSavedImages();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  // Add other necessary functions similar to CreateLogo component...

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={localStorage.getItem('username')}
        onShowGallery={() => setShowGallery(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Generate Image</h1>
            <p className="text-gray-600 mt-2">Create stunning images with AI</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Prompt Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image you want to generate..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a style</option>
                {styles.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <motion.button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </motion.button>
          </div>

          {/* Image Preview */}
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <img
                src={generatedImage}
                alt="Generated"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
              <motion.button
                onClick={() => handleDownload(generatedImage)}
                className="mt-4 bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Image
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Gallery Modal - similar to StorageMenu in CreateLogo */}
      
      <Footer />
    </div>
  );
}

export default GenerateImage;
