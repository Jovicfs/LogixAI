import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signin from './components/signin';
import Homepage from './components/Homepage';
import Signup from './components/signup';
import Pricing from './components/pricing';
import About from './components/about';
import CreateLogo from './components/CreateLogo';
import GenerateImage from './components/GenerateImage';
import GenerateVideo from './components/GenerateVideo';
import SmartEdit from './components/SmartEdit';
import { createContext, useState, useEffect } from 'react';
import { auth } from './utils/api';

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
        <AuthContext.Provider value={{ authState, setAuthState }}>
            <Routes>
                <Route path="/sign-in" element={<Signin/>} />
                <Route exact path="/" element={<Homepage/>} />
                <Route path='/sign-up' element={<Signup/>}/>
                <Route path='/pricing' element={<Pricing/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='create-logo' element={<CreateLogo/>}/>
                <Route path='create-image' element={<GenerateImage/>}/>
                <Route path='create-video' element={<GenerateVideo/>}/>
                <Route path='smart-edit' element={<SmartEdit/>}/>
            </Routes>
        </AuthContext.Provider>
    );
}

export default App;
