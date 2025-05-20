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
            title: 'Planos',
            description: 'Selecione o Plano que mais se encaixa com você!',
            icon: '📈',
            path: '/pricing'
        }
        ,
        {
            title: 'Chat com IA',
            description: 'Converse com nossa IA para obter insights e ideias.',
            icon: '',
            path: '/ai-chat'
        }
    ];

    const testimonials = [
        {
            name: 'João Victor',
            role: 'Fundador da StartUp',
            comment: 'Aqui você encontra tudo que precisa para começar a criar conteúdo.',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
        },
        // ...add more testimonials
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header isLogg
            edIn={isLoggedIn} username={username} />
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                            Gere Conteúdo de Forma Rápida e{' '}
                        <span className="text-blue-600">Inteligente</span> com IA
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Gere Posts, logos e imagens em minutos. Ideal para criadores de conteúdo.
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




          {/* Post Generator Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8">Crie Posts com Facilidade</h2>
                    <p className="text-gray-600 mb-8">
                        Utilize nossa ferramenta de geração de posts para criar conteúdo envolvente em minutos.
                    </p>
                    <Link
                        to="/post-generator"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Experimente o Gerador de Posts
                    </Link>
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