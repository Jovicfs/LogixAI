import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import LoadingSpinner from './shared/LoadingSpinner';
import withProtectedRoute from './shared/ProtectedRoute';
import StorageModal from './shared/StorageModal';

function CreateImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const [savedImages, setSavedImages] = useState([]);

  useEffect(() => {
    loadSavedImages();
  }, []);

  const fetchWithCreds = async (url, options = {}) => {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    };

    const response = await fetch(`http://localhost:5000${url}`, defaultOptions);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response;
  };

  const loadSavedImages = async () => {
    try {
      const response = await fetchWithCreds('/user_images');
      const data = await response.json();
      setSavedImages(data.images || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    
    try {
      setIsLoading(true);
      const response = await fetchWithCreds('/generate_image', {
        method: 'POST',
        body: JSON.stringify({ prompt, style })
      });

      const data = await response.json();
      setGeneratedImage(data.image_url);
      await loadSavedImages();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async (image) => {
    try {
      setIsDownloading(true);
      const imageResponse = await fetch(image.image_url);
      const imageBlob = await imageResponse.blob();
      const url = window.URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated_image_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await fetchWithCreds(`/delete_image/${imageId}`, {
        method: 'DELETE'
      });
      await loadSavedImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const imageItemRenderer = (image) => (
    <div className="space-y-2">
      <img
        src={image.image_url}
        alt={image.prompt}
        className="w-full h-40 object-cover"
      />
      <div className="text-sm text-gray-600">
        <p><strong>Prompt:</strong> {image.prompt}</p>
        <p><strong>Created:</strong> {new Date(image.created_at).toLocaleDateString()}</p>
        {image.style && <p><strong>Style:</strong> {image.style}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header 
        onShowLogos={() => setShowStorage(true)}
        buttonText="My Images"
      />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Image</h1>
            <p className="text-gray-600 mt-2">Generate amazing images with AI</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image you want to generate..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Style (Optional)</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., photorealistic, cartoon, watercolor..."
              />
            </div>

            <motion.button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt}
              className={`w-full bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors ${
                !prompt ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              whileHover={prompt ? { scale: 1.02 } : {}}
              whileTap={prompt ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Generating...</span>
                </div>
              ) : (
                'Generate Image'
              )}
            </motion.button>
          </div>

          {/* Image Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="large" />
                <p className="text-gray-600">Creating your image...</p>
              </div>
            ) : generatedImage ? (  
              <div className="space-y-6">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="max-w-full mx-auto rounded-lg shadow-lg"
                />
                <motion.button
                  onClick={() => handleDownloadImage({ image_url: generatedImage })}
                  disabled={isDownloading}
                  className="mx-auto block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDownloading ? 'Downloading...' : 'Download Image'}
                </motion.button>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Your image will appear here after generation
              </p>
            )}
          </motion.div>
        </motion.div>
      </main>

      <StorageModal
        isOpen={showStorage}
        onClose={() => setShowStorage(false)}
        items={savedImages}
        onDownload={handleDownloadImage}
        onDelete={deleteImage}
        title="Saved Images"
        itemRenderer={imageItemRenderer}
      />

      <Footer />
    </div>
  );
}

export default withProtectedRoute(CreateImage);
