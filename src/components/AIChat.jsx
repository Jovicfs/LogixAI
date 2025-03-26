import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import Header from './shared/Header';
import Footer from './shared/Footer';
import withProtectedRoute from './shared/ProtectedRoute';

function AIChat() {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-2', name: 'Claude 2' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model: selectedModel,
          api_key: apiKey
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      ]);
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
     <main className="flex-grow container mx-auto px-4 py-8 mt-16 flex flex-col items-center">
  <div className="max-w-4xl w-full flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
    
    {/* Title */}
    <h1 className="text-2xl font-semibold text-center py-4 bg-gray-100">AI Chat</h1>
    
    {/* Model Selection & API Key Input */}
    <div className="flex gap-2 p-4 border-b bg-gray-50">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="flex-grow p-2 border rounded"
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
      </select>
      <input
        type="password"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="p-2 border rounded w-64"
      />
    </div>

    {/* Chat Messages */}
    <div className="flex-grow p-4 overflow-y-auto h-96">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
          <div className={`p-3 rounded-lg max-w-xs ${
            msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}>
            {msg.content}
          </div>
        </div>
      ))}
      {isLoading && <div className="text-center text-gray-500">AI is typing...</div>}
    </div>

    {/* Message Input */}
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white sticky bottom-0">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border rounded"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        disabled={isLoading || !apiKey}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  </div>
</main>
      <Footer />
    </div>
  );
}

export default withProtectedRoute(AIChat);
