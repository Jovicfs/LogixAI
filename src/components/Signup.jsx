import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './shared/Header';
import Toast from './shared/Toast';  // Adicione esta importação
import LoadingSpinner from './shared/LoadingSpinner';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setToastMessage('Registration successful! Redirecting...');
                setShowToast(true);
                
                setTimeout(() => {
                    setShowToast(false); // Hide toast before navigating
                    navigate('/create-logo');
                }, 2000);
            } else {
                setErrors(data.errors || { general: 'Signup failed' });
            }
        } catch (error) {
            setErrors({ general: 'Network error. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
            <Header isLoggedIn={false} />
            
            <main className="pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600 mt-2">Join LogixAI today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                            >
                                <p className="text-red-600 text-center">{errors.general}</p>
                            </motion.div>
                        )}

                        {/* Form Fields */}
                        <InputField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                        />

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <InputField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner size="small" />
                                    <span className="ml-2">Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>

                        <p className="text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/sign-in" className="text-blue-600 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

const InputField = ({ label, name, type = 'text', value, onChange, error }) => (
    <div>
        <label className="block text-gray-700 font-medium mb-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
        {error && (
            <p className="mt-1 text-red-500 text-sm">{error}</p>
        )}
    </div>
);

export default Signup;