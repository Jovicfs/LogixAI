import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center">
      <header className="w-full bg-white py-4 px-8 flex justify-between items-center shadow-md">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">LogixAI</div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/about" className="text-gray-600 hover:text-gray-800">Sobre</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-gray-800">Preços</Link>
          <Link to="/features" className="text-gray-600 hover:text-gray-800">Recursos</Link>
        </nav>

        {/* Call-to-action and User Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/sign-in" className="text-gray-600 hover:text-gray-800">Login</Link>
          <Link to="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Registrar-se
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Crie seu logo com o Criador de Logos LogixAI
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mb-6">
          Apresente sua marca e crie um logo gratuito com apenas alguns cliques. Experimente agora e dê vida às suas ideias!
        </p>
        <Link to="/create-logo" className="bg-black text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-800">
          Criar já
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} LogixAI. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default HomePage;