import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Header from './shared/Header';
import Footer from './shared/Footer';
// Material UI Icons - more diverse
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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
            icon: <BrushIcon sx={{ fontSize: 32, color: theme.palette.primary.contrastText }} />,
            path: '/create-logo',
            gradient: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
        },
        {
            title: 'Posts IA',
            description: 'Gere posts para redes sociais.',
            icon: <ArticleIcon sx={{ fontSize: 32, color: theme.palette.warning.contrastText }} />,
            path: '/post-generator',
            gradient: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
        },
        {
            title: 'Remover Fundo',
            description: 'Remova o fundo de imagens.',
            icon: <ImageIcon sx={{ fontSize: 32, color: theme.palette.success.contrastText }} />,
            path: '/remove-background',
            gradient: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
        },
        {
            title: 'Vídeos com IA',
            description: 'Crie vídeos incríveis em instantes.',
            icon: <VideoLibraryIcon sx={{ fontSize: 32, color: theme.palette.error.contrastText }} />,
            path: '/create-video',
            gradient: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
        },
        {
            title: 'Sintetizador de Voz',
            description: 'Transforme texto em fala natural.',
            icon: <GraphicEqIcon sx={{ fontSize: 32, color: theme.palette.info.contrastText }} />,
            path: '/text-to-speech',
            gradient: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`
        },
        {
            title: 'Imagens IA',
            description: 'Arte digital inteligente.',
            icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: theme.palette.secondary.contrastText }} />,
            path: '/create-image',
            gradient: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`
        },
        {
            title: 'Chat IA',
            description: 'Assistente inteligente.',
            icon: <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: theme.palette.success.contrastText }} />,
            path: '/ai-chat',
            gradient: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
        },
        {
            title: 'Premium',
            description: 'Acesso completo.',
            icon: <WorkspacePremiumIcon sx={{ fontSize: 32, color: theme.palette.primary.contrastText }} />,
            path: '/pricing',
            gradient: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
        }
    ];


    // Add ref for features section

    const featuresRef = React.useRef(null);

    const handleScrollToFeatures = () => {
        if (featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                    <h1
                   className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight animate-pulse"
                   style={{
                    background: 'linear-gradient(90deg, #00F5FF, #8A2BE2, #FF00FF, #FF1493)',
                    backgroundSize: '300% 300%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                    textShadow: `0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)`,
                    padding: '0.5rem',
                    animation: 'pulseText 10s infinite linear'
                    }}
                    >
                    Potencialize sua criatividade com IA
                 </h1> 
                       <p
                            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
                            style={{ color: theme.palette.text.primary, textShadow: `0 1px 2px rgba(0, 0, 0, 0.1)` }}
                        >
                            Descubra como nossa plataforma de IA pode transformar suas ideias em realidade
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/sign-up"
                                    className="px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        color: theme.palette.primary.contrastText
                                    }}
                                >
                                    Começar Gratuitamente
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/ai-chat"
                                    className="px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        background: theme.palette.background.paper,
                                        color: theme.palette.text.primary,
                                        border: `1px solid ${theme.palette.divider}`
                                    }}
                                >
                                    Experimente o Chat IA
                                </Link>
                            </motion.div>
    
                        </div>
                    </motion.div>          
                </div>
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3w5MTMyMnwwfDF8c2VhcmNofDh8fGludGVsbGlnZW5jZXxlbnwwfHx8fDE2ODU4MzIzOTZ8MA&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-slate-700 bg-center opacity-15"></div>

                <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
                    animate={{ y: [0, 16, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    onClick={handleScrollToFeatures}
                >
                    <KeyboardArrowDownIcon sx={{ fontSize:'2.5rem', color: theme.palette.text.primary }} />
                </motion.div>
   

            </section>

            {/* Features Section */}
            <section
                ref={featuresRef}
                className="py-12 sm:py-16 lg:py-20"
                style={{ background: theme.palette.background.default, color: theme.palette.text.primary }}
            >
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
                                    <div
                                        className="rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                                        style={{
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                                            style={{
                                                background: feature.gradient,
                                                boxShadow: theme.shadows[2]
                                            }}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2" style={{ color: theme.palette.text.primary }}>{feature.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2" style={{ color: theme.palette.text.secondary }}>{feature.description}</p>
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
            <Footer />
        </div>
    );
}

export default HomePage;
