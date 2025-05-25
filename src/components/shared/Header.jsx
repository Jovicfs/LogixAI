import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { auth } from '../../utils/api';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

function Header({ onShowLogos, buttonText = "Meus Logos" }) {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: 'Gerar Logo',
      path: '/create-logo',
      icon: <AutoAwesomeIcon fontSize="small" />
    },
    {
      title: 'Gerar Post',
      path: '/post-generator',
      icon: <RocketLaunchIcon fontSize="small" />
    },
    {
      title: 'Gerar Imagem',
      path: '/create-image',
      icon: <ImageIcon fontSize="small" />
    },
    {
      title: 'Chat com IA',
      path: '/ai-chat',
      icon: <ChatIcon fontSize="small" />
    },
    {
      title: 'Planos',
      path: '/pricing',
      icon: <MonetizationOnIcon fontSize="small" />
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

        <nav className="hidden md:flex space-x-6">
          {features.map(feature => (
            <Link
              key={feature.path}
              to={feature.path}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors space-x-1"
            >
              {feature.icon}
              <span>{feature.title}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {authState.isAuthenticated ? (
            <>
              <span className="flex items-center text-gray-600 space-x-1">
                <AccountCircleIcon fontSize="small" />
                <span>{authState.username}</span>
              </span>
              {onShowLogos && (
                <button
                  onClick={onShowLogos}
                  className="text-gray-600 hover:text-blue-600 px-4 py-2"
                >
                  {buttonText}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <LogoutIcon fontSize="small" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-4 items-center">
              <Link
                to="/sign-in"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 flex items-center space-x-1"
              >
                <LoginIcon fontSize="small" />
                <span>Login</span>
              </Link>
              <Link
                to="/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 flex items-center space-x-1"
              >
                <RocketLaunchIcon fontSize="small" />
                <span>Começar Agora</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
