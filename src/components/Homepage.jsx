import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';

function HomePage() {
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

    const features = [
        {
            title: 'Criação de Vídeos',
            description: 'Animações e vídeos profissionais em minutos.',
            icon: '🎥',
            path: '/create-video'
        },
        {
            title: 'Design de Logos',
            description: 'Identidade visual única e personalizada.',
            icon: '✨',
            path: '/create-logo'
        },
        {
            title: 'Geração de Imagens',
            description: 'Transforme ideias em arte digital com IA.',
            icon: '🎨',
            path: '/create-image'
        },
        {
            title: 'Edição Inteligente',
            description: 'Ferramentas avançadas de edição com IA.',
            icon: '⚡',
            path: '/smart-edit' 
        },
        {
            title: 'Planos',
            description: 'Selecione o Plano que mais se encaixa com você!',
            icon: '📈',
            path: '/pricing'
        }
    ];

    const testimonials = [
        {
            name: 'João Silva',
            role: 'Empreendedor',
            comment: 'Revolucionou a forma como crio conteúdo para minha empresa.',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        // ...add more testimonials
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header isLoggedIn={isLoggedIn} username={username} />
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Crie Conteúdo de Forma Rápida e{' '}
                        <span className="text-blue-600">Inteligente</span> com IA
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Gere vídeos, logos e imagens incríveis em minutos. Sem necessidade de habilidades técnicas.
                    </motion.p>

                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/sign-up"
                            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Experimente Gratuitamente
                        </Link>
                        <button className="bg-gray-100 text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors">
                            Veja um Exemplo
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nossas Ferramentas</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.path}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <Link
                                    to={feature.path}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Experimente →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">O Que Dizem Nossos Usuários</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">{testimonial.comment}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default HomePage;