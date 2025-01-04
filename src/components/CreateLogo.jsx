import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  const features = [
    {
      title: 'Criação de Vídeos',
      path: '/create-video'
    },
    {
      title: 'Design de Logos',
      path: '/create-logo'
    },
    {
      title: 'Geração de Imagens',
      path: '/create-image'
    },
    {
      title: 'Edição Inteligente',
      path: '/smart-edit'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              LogixAI
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {features.map(feature => (
              <Link
                key={feature.path}
                to={feature.path}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {feature.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStorageMenu(true)}
              className="text-gray-600 hover:text-blue-600"
            >
              Meus Logos
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crie Seu Logo</h1>
            <p className="text-gray-600 mt-2">{protectedMessage}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: TechCorp"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Setor</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Tecnologia"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">Estilo</label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Minimalista, Futurista, Orgânico, Vintage..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Seja criativo!
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Cor Principal</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-12 w-24 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <span className="text-gray-600">{color.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            onClick={handleGenerateLogo}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Gerar Logo
          </motion.button>

          {/* Logo Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            {generatedLogo ? (
              <div className="space-y-6">
                <img
                  src={generatedLogo}
                  alt="Logo Gerado"
                  className="max-w-md mx-auto rounded-lg shadow-lg"
                />
                <motion.button
                  onClick={handleDownloadLogo}
                  disabled={isDownloading}
                  className="mx-auto block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDownloading ? 'Baixando...' : 'Baixar Logo'}
                </motion.button>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Seu logo aparecerá aqui após a geração
              </p>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Storage Menu Modal */}
      {showStorageMenu && <StorageMenu />}
    </div>
  );
}

export default CreateLogo;
