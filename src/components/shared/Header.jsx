import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { auth } from '../../utils/api';

function Header({ onShowLogos, buttonText = "Meus Logos" }) {  // Add default value
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
    },
    {
      title: 'Planos',
      path: '/pricing'
    }
  ];

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
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
          {authState.isAuthenticated ? (
            <>
              <span className="text-gray-600">{authState.username}</span>
              {onShowLogos && (
                <button
                  onClick={onShowLogos}
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                >
                  {buttonText}  {/* Use the buttonText prop here */}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/sign-in" className="text-gray-600 hover:text-blue-600 px-4 py-2">
                Login
              </Link>
              <Link to="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Começar Agora
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
