import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LogixAI</h3>
            <p className="text-gray-400">Transformando ideias em realidade com IA</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2">
              <li><Link to="/create-logo" className="text-gray-400 hover:text-white">Criação de Logos</Link></li>
              <li><Link to="/create-video" className="text-gray-400 hover:text-white">Criação de Vídeos</Link></li>
              <li><Link to="/create-image" className="text-gray-400 hover:text-white">Geração de Imagens</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">Sobre</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white">Preços</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacidade</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LogixAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
