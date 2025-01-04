import React, { useState, useEffect } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';

function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const plans = [
    {
      name: 'Básico',
      price: 'Grátis',
      features: [
        '3 Logos em baixa resolução',
        'Uso não comercial',
        'Suporte limitado',
      ],
    },
    {
      name: 'Padrão',
      price: 'R$29,90',
      features: [
        '5 Logos em alta resolução',
        'Uso comercial',
        'Revisões ilimitadas',
        'Suporte prioritário',
      ],
    },
    {
      name: 'Premium',
      price: 'R$49,90',
      features: [
        'Logos ilimitados em alta resolução',
        'Uso comercial completo',
        'Arquivos vetoriais (SVG)',
        'Suporte 24/7',
        'Direitos exclusivos',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header isLoggedIn={isLoggedIn} username={username} />
      
      <main className="pt-24 pb-12">
        <section id="pricing" className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nossos Planos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 justify-center">
                <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                <div className="text-2xl font-bold text-blue-500 mb-4">{plan.price}</div>
                <ul className="list-disc pl-6 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">{feature}</li>
                  ))}
                </ul>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                  Escolher Plano {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Pricing;