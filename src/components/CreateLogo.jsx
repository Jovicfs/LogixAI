import React, { useState, useEffect } from 'react';

function CreateLogo() {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('#000000');
  const [generatedLogo, setGeneratedLogo] = useState('');
  const [protectedMessage, setProtectedMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [savedLogos, setSavedLogos] = useState([]);
  const [showStorageMenu, setShowStorageMenu] = useState(false);

  useEffect(() => {
    fetchProtectedData();
    loadSavedLogos();
  }, []);

  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Corrigido: Adicionado "Bearer"
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProtectedMessage(data.message);
      } else {
        console.error('Failed to fetch protected data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadSavedLogos = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading logos with token:', token);
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/user_logos', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      setSavedLogos(data.logos || []);
    } catch (error) {
      console.error('Error loading logos:', error);
      // Add user feedback
      alert('Failed to load logos. Please try logging in again.');
    }
  };

  // Update all other fetch calls with similar configuration
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const defaultOptions = {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  };

  // Use fetchWithAuth in other functions
  const handleGenerateLogo = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5000/generate_logo', {
        method: 'POST',
        body: JSON.stringify({
          companyName,
          sector,
          style,
          color: color.replace('#', '')
        }),
      });

      const data = await response.json();
      setGeneratedLogo(data.logo);
      loadSavedLogos();
    } catch (error) {
      console.error('Error generating logo:', error);
      alert('Failed to generate logo. Please try again.');
    }
  };

  const deleteLogo = async (logoId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/delete_logo/${logoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadSavedLogos(); // Reload logos after deletion
      } else {
        console.error('Failed to delete logo');
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
    }
  };

  const handleDownloadSpecificLogo = async (logo) => {
    try {
      setIsDownloading(true);
      const imageResponse = await fetch(logo.image_url); // Changed from logo.url to logo.image_url
      const imageBlob = await imageResponse.blob();
      const url = window.URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${logo.company_name.replace(/\s+/g, '_')}_logo.png`; // Changed from logo.companyName to logo.company_name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading logo:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadLogo = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token');

      // First fetch the image as a blob
      const imageResponse = await fetch(generatedLogo);
      const imageBlob = await imageResponse.blob();

      // Create a download link
      const url = window.URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName.replace(/\s+/g, '_')}_logo.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading logo:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const StorageMenu = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Saved Logos</h2>
          <button
            onClick={() => setShowStorageMenu(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedLogos.map((logo) => (
            <div key={logo.id} className="border rounded-lg p-4">
              <img
                src={logo.image_url}
                alt={`Logo for ${logo.company_name}`}
                className="w-full h-40 object-contain mb-2"
              />
              <div className="text-sm text-gray-600">
                <p><strong>Company:</strong> {logo.company_name}</p>
                <p><strong>Created:</strong> {new Date(logo.created_at).toLocaleDateString()}</p>
                {logo.sector && <p><strong>Sector:</strong> {logo.sector}</p>}
                {logo.style && <p><strong>Style:</strong> {logo.style}</p>}
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleDownloadSpecificLogo(logo)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteLogo(logo.id)}
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
    <div className="bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">AI Logo Generator</h1>
          <button
            onClick={() => setShowStorageMenu(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Saved Logos
          </button>
        </div>
        
        <p className="text-center text-gray-500 mb-4">{protectedMessage}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Company Name:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., TechCorp"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sector:</label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Technology"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Style:</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Modern, Minimal"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Color Preference:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateLogo}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-blue-700 transition duration-300"
        >
          Generate Logo
        </button>

        <div className="mt-8 text-center">
          {generatedLogo ? (
            <>
              <img
                src={generatedLogo}
                alt="Generated Logo"
                className="mx-auto max-w-full h-auto border border-gray-300 rounded-lg p-4"
              />
              <button
                onClick={handleDownloadLogo}
                disabled={isDownloading}
                className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
              >
                {isDownloading ? 'Downloading...' : 'Download Logo'}
              </button>
            </>
          ) : (
            <p className="text-gray-500">Your generated logo will appear here.</p>
          )}
        </div>

        <h2 className="text-xl font-bold mt-10 text-gray-800">Logo Editor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Edit Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Font Style:</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Arial</option>
              <option>Helvetica</option>
              <option>Times New Roman</option>
              <option>Roboto</option>
              <option>Montserrat</option>
            </select>
          </div>
        </div>
        
        {showStorageMenu && <StorageMenu />}
      </div>
    </div>
  );
}

export default CreateLogo;
