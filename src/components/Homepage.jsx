import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Header from './shared/Header';
import Footer from './shared/Footer';
// Material UI Icons
import {
    AutoAwesome as AutoAwesomeIcon,
    Brush as BrushIcon,
    SmartToy as SmartToyIcon,
    RocketLaunch as RocketLaunchIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Image as ImageIcon
} from '@mui/icons-material';

function HomePage() {
    const theme = useTheme();
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
            title: 'Logos IA',
            description: 'Crie logos únicos em minutos.',
            icon: <BrushIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/create-logo',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Posts IA',
            description: 'Gere posts para redes sociais.',
            icon: <RocketLaunchIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/create-post',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        {
            title: 'Editor de Imagens',
            description: 'Edite imagens com IA.',
            icon: <ImageIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/edit-image',
            gradient: 'from-green-500 to-green-600'
        },
        { title: 'Vídeos com IA',
            description: 'Crie vídeos incríveis em instantes.',
            icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/create-video',
            gradient: 'from-red-500 to-red-600'            
        
        },
        {
            title: 'Sintetizador de Voz',
            description: 'Transforme texto em fala natural.',
            icon: <SmartToyIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/text-to-speech',
            gradient: 'from-purple-500 to-purple-600'   
        },
        {   
            title: 'Imagens IA',
            description: 'Arte digital inteligente.',
            icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/create-image',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Chat IA',
            description: 'Assistente inteligente.',
            icon: <SmartToyIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/ai-chat',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Premium',
            description: 'Acesso completo.',
            icon: <RocketLaunchIcon sx={{ fontSize: 32, color: '#fff' }} />,
            path: '/pricing',
            gradient: 'from-red-500 to-red-600'
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
        <div className="min-h-screen" style={{ background: theme.palette.background.default }}>
            <Header isLoggedIn={isLoggedIn} username={username} />

            {/* Hero Section */}
            <section className="min-h-[100vh] flex flex-col justify-center relative px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text leading-tight">
                            Potencialize sua criatividade com IA
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Descubra como nossa plataforma de IA pode transformar suas ideias em realidade.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/sign-up"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Começar Gratuitamente
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/ai-chat"
                                    className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Experimente o Chat IA
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-600 opacity-20"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
            <KeyboardArrowDownIcon className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-bounce" sx={{ fontSize: 40 }} />
            
            </section>
            {/* Features Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.path}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="relative group"
                            >
                                <Link to={feature.path}>
                                    <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{feature.description}</p>
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <RocketLaunchIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Experiências</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                                        <p className="text-gray-500 text-xs">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">{testimonial.comment}</p>
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
