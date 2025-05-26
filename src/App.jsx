import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import Signin from './components/signin';
import Homepage from './components/Homepage';
import Signup from './components/signup';
import Pricing from './components/pricing';
import About from './components/about';
import CreateLogo from './components/CreateLogo';
import GenerateImage from './components/GenerateImage';
import AIChat from './components/AIChat';
import PostGenerator from './components/shared/PostGenerator';
import RemoveBackground from './components/RemoveBackground';

export const AuthContext = createContext(null);

function App() {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        username: null,
        loading: true
    });

    useEffect(() => {
        fetch('http://localhost:5000/verify-session', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setAuthState({
                isAuthenticated: data.authenticated,
                username: data.username,
                loading: false
            });
        })
        .catch(() => {
            setAuthState({
                isAuthenticated: false,
                username: null,
                loading: false
            });
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Routes>
                    <Route path="/sign-in" element={<Signin />} />
                    <Route exact path="/" element={<Homepage />} />
                    <Route path="/sign-up" element={<Signup />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/create-logo" element={<CreateLogo />} />
                    <Route path="/create-image" element={<GenerateImage />} />
                    <Route path="/ai-chat" element={<AIChat />} />
                    <Route path="/post-generator" element={<PostGenerator />} />
                    <Route path="/remove-background" element={<RemoveBackground />} />
                </Routes>
            </AuthContext.Provider>
        </ThemeProvider>
    );
}

export default App;
