import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    username: ''
  });

  const login = async (username, password) => {
    console.log('Login called with:', username); // Debug log
    try {
      const result = await authService.login(username, password);
      console.log('Login result:', result); // Debug log

      if (result.success) {
        setState(prev => ({
          ...prev,
          authenticated: true,
          username: result.username
        }));
      }
      return result;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setState(prev => ({
        ...prev,
        authenticated: false,
        username: ''
      }));
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const authenticateAfterSignup = (username) => {
    // Only store username in localStorage, token will be in HTTPOnly cookie
    localStorage.setItem('username', username);
    setState(prev => ({
      ...prev,
      authenticated: true,
      username: username
    }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/verify-session', {
          credentials: 'include' // Important for cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          setState(prev => ({
            ...prev,
            authenticated: true,
            username: data.username,
            loading: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            authenticated: false,
            username: '',
            loading: false
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          authenticated: false,
          username: '',
          loading: false
        }));
      }
    };

    checkAuth();
  }, []);

  const contextValue = {
    authenticated: state.authenticated,
    loading: state.loading,
    username: state.username,
    login, // Make sure login is included here
    logout,
    authenticateAfterSignup
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          isAuthenticated: true,
          username: data.username,
          loading: false
        });
        setNotification({
          message: 'Registration successful! Welcome to LogixAI!',
          type: 'success'
        });
        navigate('/create-logo');
        return true;
      } else {
        setError(data.errors || { general: 'Signup failed' });
        return false;
      }
    } catch (err) {
      setError({ general: 'Network error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Rest of the hook implementation...
  
  return {
    signup,
    error,
    loading,
    authState,
    notification,
    setNotification,
    // Other methods...
  };
}

export default useAuth;
