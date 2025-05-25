import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Tooltip } from '@mui/material';

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
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-8">
          <div className="flex-shrink-0 mb-4">
            <span className="text-2xl font-bold text-white">LogixAI</span>
            <p className="text-gray-400 mt-2 text-sm max-w-xs">
              Automatize a criação de conteúdo com IA e eleve sua produtividade.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex-shrink-0">
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-1">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-white transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col items-start">
            <h4 className="text-sm font-semibold mb-3">Siga-nos</h4>
            <div className="flex space-x-4">
              <Tooltip title="Facebook">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <FacebookIcon />
                </a>
              </Tooltip>
              <Tooltip title="GitHub">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <GitHubIcon />
                </a>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <LinkedInIcon />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LogixAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
