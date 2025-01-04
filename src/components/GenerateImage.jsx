import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { AuthContext } from '../App';

function GenerateImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const { authState } = useContext(AuthContext);

  const styles = [
    'Realistic', 'Artistic', 'Digital Art', 'Watercolor',
    'Oil Painting', '3D Render', 'Sketch', 'Anime',
    'Abstract', 'Minimalist', 'Photography', 'Surreal'
  ];

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/generate_image', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
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

  const loadSavedImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/user_images', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSavedImages(data.images);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_image/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        loadSavedImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const ImageGallery = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Saved Images</h2>
          <button
            onClick={() => setShowGallery(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedImages.map((image) => (
            <div key={image.id} className="border rounded-lg p-4">
              <img
                src={image.image_url}
                alt={image.prompt}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="text-sm text-gray-600 mb-2">{image.prompt}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleDownload(image.image_url)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header 
        onShowLogos={() => setShowGallery(true)}
        buttonText="Minhas Imagens"  // Change to regular comment
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

      {showGallery && <ImageGallery />}
      <Footer />
    </div>
  );
}

export default GenerateImage;
