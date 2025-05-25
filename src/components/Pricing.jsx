import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Header from './shared/Header';
// Removed Footer import
import { Check, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/payment/status', {
        credentials: 'include'
      });
      const data = await response.json();
      setHasValidPayment(data.status === 'active');
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handlePayment = async (price) => {
    setLoading(true);
    setError(null);

    try {
        const response = await fetch('http://localhost:5000/payment/create-checkout-session', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
        }

        const { sessionId } = await response.json();
        
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
            throw new Error('Failed to load Stripe');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Payment error:', error);
        setError(error.message || 'Payment processing failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Acesso Premium</h1>
          <p className="text-xl text-gray-600">Desbloqueie todo o potencial da IA</p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Acesso Total</h2>
            <p className="opacity-90 mb-6">Todos os recursos em uma única assinatura</p>
            <p className="text-4xl font-bold mb-6">R$5,00</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Chat de IA Ilimitado
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Gerador de Logotipos
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Gerador de Imagens
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Suporte Premium
              </li>
            </ul>
            {hasValidPayment ? (
              <button 
                className="w-full py-3 px-6 bg-green-500 text-white rounded-xl font-semibold"
                disabled
              >
                Acesso Ativo
              </button>
            ) : (
              <button 
                onClick={() => handlePayment(5.00)}
                disabled={loading}
                className="w-full py-3 px-6 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Acessar Agora'}
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Footer component removed */}
    </div>
  );
}

export default Pricing;