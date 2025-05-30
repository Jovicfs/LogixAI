import React from 'react';
import Header from './shared/Header';
import { motion } from 'framer-motion';
import { 
  AutoFixHigh, 
  Psychology, 
  Speed, 
  Rocket 
} from '@mui/icons-material';

function About() {
  const features = [
    {
      icon: <AutoFixHigh className="text-4xl text-blue-500" />,
      title: "IA Avançada",
      description: "Tecnologia de ponta para resultados profissionais"
    },
    {
      icon: <Speed className="text-4xl text-blue-500" />,
      title: "Alta Performance",
      description: "Resultados em segundos, não em dias"
    },
    {
      icon: <Psychology className="text-4xl text-blue-500" />,
      title: "Interface Intuitiva",
      description: "Fácil de usar, resultados profissionais"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Potencialize seus Projetos com IA
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Uma plataforma completa de ferramentas de IA para transformar suas ideias em realidade
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a LogixAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossas Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Tools 
              title="Geração de Logos" 
              description="Crie logos profissionais em segundos usando IA"
              gradient="from-blue-500 to-blue-700"
            />
            <Tools 
              title="Geração de Imagens" 
              description="Transforme texto em imagens impressionantes"
              gradient="from-purple-500 to-purple-700"
            />
            <Tools 
              title="Chat IA" 
              description="Assistente virtual inteligente para suas necessidades"
              gradient="from-green-500 to-green-700"
            />
            <Tools 
              title="Remoção de Fundo" 
              description="Remove fundos de imagens automaticamente"
              gradient="from-orange-500 to-orange-700"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Comece Agora</h2>
          <p className="text-xl mb-8 opacity-90">
            Faça parte da equipe de usuários que já usam nossas ferramentas
          </p>
          <motion.a
            href="/sign-up"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Conta Gratuita
          </motion.a>
        </div>
      </section>
    </div>
  );
}

// Helper component for tools section
const Tools = ({ title, description, gradient }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`p-6 rounded-xl text-white bg-gradient-to-r ${gradient}`}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-100">{description}</p>
  </motion.div>
);

export default About;