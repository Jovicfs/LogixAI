import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const links = {
    Produtos: [
      { to: '/create-logo', label: 'Logos' },
      { to: '/create-video', label: 'Vídeos' },
      { to: '/create-image', label: 'Imagens' }
    ],
    Empresa: [
      { to: '/about', label: 'Sobre' },
      { to: '/pricing', label: 'Preços' }
    ],
    Legal: [
      { to: '/privacy', label: 'Privacidade' },
      { to: '/terms', label: 'Termos' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-shrink-0">
            <span className="text-lg font-bold">LogixAI</span>
          </div>
          
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex-shrink-0">
              <h4 className="text-sm font-semibold mb-2">{category}</h4>
              <ul className="space-y-1">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LogixAI</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
