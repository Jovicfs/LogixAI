import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add framer-motion for animations

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (storedToken && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/'); // Redireciona para a página inicial após o logout
    };

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
            {/* Header */}
            <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            LogixAI
                        </span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        {features.map(feature => (
                            <Link
                                key={feature.path}
                                to={feature.path}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {feature.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-gray-600">{username}</span> {/* Exibe o nome do usuário */}
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                    Sair
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/sign-in" className="text-gray-600 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                                    Começar Agora
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">LogixAI</h3>
                            <p className="text-gray-400">Transformando ideias em realidade com IA</p>
                        </div>
                        {/* Add more footer sections */}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;