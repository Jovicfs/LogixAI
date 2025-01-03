import React, { useState, useEffect } from 'react';

function CreateLogo() {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('#000000');
  const [generatedLogo, setGeneratedLogo] = useState('');
  const [protectedMessage, setProtectedMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProtectedData();
  }, []);

  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/protected', {
        method: 'GET',
        headers: {
          'Authorization': token,
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

  const handleGenerateLogo = async () => {
    try {
      console.log('Generating logo with parameters:', {
        companyName,
        sector,
        style,
        color
      });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/generate_logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ 
          companyName, 
          sector, 
          style, 
          color: color.replace('#', '') // Ensure # is removed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Generated logo URL:', data.logo);
        setGeneratedLogo(data.logo);
      } else {
        const errorData = await response.json();
        console.error('Failed to generate logo:', errorData);
      }
    } catch (error) {
      console.error('Error generating logo:', error);
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

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">AI Logo Generator</h1>
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
      </div>
    </div>
  );
}

export default CreateLogo;
