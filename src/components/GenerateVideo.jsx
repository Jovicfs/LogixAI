import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import LoadingSpinner from './shared/LoadingSpinner';
import withProtectedRoute from './shared/ProtectedRoute';
import StorageModal from './shared/StorageModal';

function GenerateVideo() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const styles = ['Style1', 'Style2', 'Style3']; // Add your styles here

  useEffect(() => {
    loadSavedVideos();
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

  const loadSavedVideos = async () => {
    try {
      const response = await fetchWithCreds('/user_videos');
      const data = await response.json();
      setSavedVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    
    try {
      setIsLoading(true);
      const response = await fetchWithCreds('/generate_video', {
        method: 'POST',
        body: JSON.stringify({ prompt, duration, style }),
      });

      const data = await response.json();
      setGeneratedVideo(data.video_url);
      await loadSavedVideos();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadVideo = async (video) => {
    try {
      setIsDownloading(true);
      const response = await fetchWithCreds(`/download_video/${video.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading video:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      await fetchWithCreds(`/delete_video/${videoId}`, {
        method: 'DELETE'
      });
      await loadSavedVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const videoItemRenderer = (video) => (
    <div className="space-y-2">
      <video
        src={video.video_url}
        className="w-full h-40 object-cover rounded-lg"
        controls
      />
      <div className="text-sm text-gray-600">
        <p><strong>Prompt:</strong> {video.prompt}</p>
        <p><strong>Created:</strong> {new Date(video.created_at).toLocaleDateString()}</p>
        {video.style && <p><strong>Style:</strong> {video.style}</p>}
        {video.duration && <p><strong>Duration:</strong> {video.duration}s</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header 
        onShowLogos={() => setShowStorage(true)}
        buttonText="My Videos"
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
                onClick={() => handleDownloadVideo({ id: 'latest', video_url: generatedVideo })}
                disabled={isDownloading}
                className="mt-4 bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDownloading ? 'Downloading...' : 'Download Video'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>

      <StorageModal
        isOpen={showStorage}
        onClose={() => setShowStorage(false)}
        items={savedVideos}
        onDownload={handleDownloadVideo}
        onDelete={deleteVideo}
        title="Saved Videos"
        itemRenderer={videoItemRenderer}
      />

      <Footer />
    </div>
  );
}

export default withProtectedRoute(GenerateVideo);
