import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    
    function Signup() {
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const navigate = useNavigate();
    
      const handleSignup = async () => {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
    
        try {
          const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('Signup successful:', data);
            localStorage.setItem('token', data.token);
            navigate('/');
          } else {
            console.error('Signup failed');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
      return (
        <div className=" bg-gradient-to-r from-blue-400 to-blue-300 min-h-screen flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-6  text-blue-600">Create an Account</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              onClick={handleSignup}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-500 hover:text-blue-700 font-bold">
                Log In
              </a>
            </p>
          </div>
          
        </div>
      );
    }
    
    export default Signup;
