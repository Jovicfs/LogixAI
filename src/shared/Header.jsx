import React from 'react';
import { Link } from 'react-router-dom';

function Header({ onShowLogos, buttonText }) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          LogixAI
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/generate-post"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Post
          </Link>
          <button
            onClick={onShowLogos}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
