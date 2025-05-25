import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Footer from './shared/Footer';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ImageIcon from '@mui/icons-material/Image';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
            icon: <DesignServicesIcon fontSize="large" className="text-blue-600" />,
            path: '/create-logo'
        },
        {
            title: 'Geração de Imagens',
            description: 'Transforme ideias em arte digital com IA.',
            icon: <ImageIcon fontSize="large" className="text-green-600" />,
            path: '/create-image'
        },
        {
            title: 'Preço',
            description: 'Efetue o pagamento para ter acesso às nossas ferramentas!',
            icon: <PaymentsIcon fontSize="large" className="text-yellow-600" />,
            path: '/pricing'
        },
        {
            title: 'Chat com IA',
            description: 'Converse com nossa IA para obter insights e ideias.',
            icon: <ChatIcon fontSize="large" className="text-purple-600" />,
            path: '/ai-chat'
        }
    ];

    const testimonials = [
        {
            name: 'João Victor',
            role: 'Fundador da StartUp',
            comment: 'Aqui você encontra tudo que precisa para começar a criar conteúdo.',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header isLoggedIn={isLoggedIn} username={username} />

            {/* Hero */}
            <section className="pt-28 pb-20 px-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="container mx-auto text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Aumente sua produtividade com{' '}
                        <span className="text-blue-600">Inteligência Artificial</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Crie posts, logos e imagens em minutos. Prático, rápido e inteligente.
                    </motion.p>

                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/sign-up"
                            className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
                        >
                            Começar agora <ArrowForwardIosIcon fontSize="small" />
                        </Link>
                        <Link
                            to="/post-generator"
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Ver exemplos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Nossas Ferramentas</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.path}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <Link
                                    to={feature.path}
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    Experimente <ArrowForwardIosIcon fontSize="small" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Crie Posts com Facilidade</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Nossa IA entende sua ideia e entrega conteúdo de qualidade em segundos.
                    </p>
                    <Link
                        to="/post-generator"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Gerar Post Agora
                    </Link>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">O Que Dizem Nossos Usuários</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
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
                                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{testimonial.comment}</p>
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
