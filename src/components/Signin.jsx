import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Store token and username in localStorage (for persistence)
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);

        // Redirect to homepage and update UI with username
        navigate('/'); // Redirect to homepage
      } else {
        console.error('Login failed');
        // Handle login failure (e.g., display error message to user)
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors (e.g., display generic error message)
    }
  };

  useEffect(() => {
    // Check for existing token and username in localStorage on component mount
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedUsername) {
      // User is already logged in, redirect to homepage (optional)
      navigate('/');  // Uncomment if automatic redirect is desired
    }
  }, []); // Empty dependency array to run only on component mount

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-4">Login to your account</p>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Login
        </button>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account? <a href="/sign-up" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;