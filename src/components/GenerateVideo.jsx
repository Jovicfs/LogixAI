import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';

function GenerateVideo() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const styles = [
    '3D Animation', 'Motion Graphics', 'Cartoon',
    'Realistic', 'Abstract', 'Cinematic'
  ];

  const handleGenerateVideo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/generate_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ prompt, duration, style }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedVideo(data.video_url);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate video');
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
            <h1 className="text-3xl font-bold text-gray-900">Generate Video</h1>
            <p className="text-gray-600 mt-2">Create amazing videos with AI</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Video Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the video you want to generate..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={5}
                  max={60}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>

            <motion.button
              onClick={handleGenerateVideo}
              disabled={isLoading || !prompt}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </motion.button>
          </div>

          {/* Video Preview */}
          {generatedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <video
                controls
                className="w-full rounded-lg shadow-lg"
                src={generatedVideo}
              />
              <motion.button
                onClick={() => handleDownload(generatedVideo)}
                className="mt-4 bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Video
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default GenerateVideo;
