import React from 'react';

function About () {
  return (
    <section id="about" className="py-12 bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Sobre Nós</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Somos uma equipe apaixonada por design e tecnologia, dedicada a fornecer uma solução inovadora para criação de logos.
          Nossa plataforma utiliza inteligência artificial de ponta para gerar logos únicos e profissionais em segundos,
          economizando tempo e recursos para empreendedores e empresas de todos os tamanhos.
        </p>

        <h2 className="text-3xl font-bold text-center mb-8 text-white">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <span className="text-4xl font-bold text-blue-500 mb-4 block">1</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Insira Informações</h3>
            <p className="text-gray-700">Digite o nome da sua empresa, slogan (opcional) e selecione o setor de atuação.</p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-blue-500 mb-4 block">2</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">IA Gera Logos</h3>
            <p className="text-gray-700">Nosso algoritmo de IA analisa suas informações e gera diversas opções de logos personalizados.</p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-blue-500 mb-4 block">3</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalize e Baixe</h3>
            <p className="text-gray-700">Escolha o logo que mais te agrada, personalize cores e fontes, e baixe os arquivos em alta resolução.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-white">Por que escolher nossa IA?</h2>
        <div className="prose lg:prose-xl text-gray-700">
          <ul>
            <li><strong>Rapidez:</strong> Crie logos em segundos.</li>
            <li><strong>Variedade:</strong> Diversas opções de design para escolher.</li>
            <li><strong>Personalização:</strong> Ajuste cores, fontes e layouts.</li>
            <li><strong>Economia:</strong> Solução acessível comparada a designers tradicionais.</li>
            <li><strong>Qualidade:</strong> Logos profissionais com design moderno.</li>
          </ul>
        </div>
        
      </div>
    </section>
    
  );
};

export default About;