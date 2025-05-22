import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, History, Menu, X } from 'lucide-react';
import withProtectedRoute from './shared/ProtectedRoute';
import Header from './shared/Header';

function AIChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/chat/history', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Erro ao buscar histórico');
      }
    } catch (err) {
      console.error(err);
      setError('Erro na conexão com o servidor');
    }
  };

  const handleHistoryClick = (item) => {
    // Exibe só aquela mensagem no chat
    setMessages([
      { role: item.role, content: item.content },
    ]);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('prompt', message);
      if (selectedImage) formData.append('image', selectedImage);

      const res = await fetch('http://localhost:5000/chat/chat', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no chat');

      const newMessages = [
        { role: 'user', content: message, image: selectedImage ? URL.createObjectURL(selectedImage) : null },
        { role: 'assistant', content: data.response, meta: { model: data.model, ms: data.duration_ms } }
      ];

      setMessages(prev => [...prev, ...newMessages]);
      setMessage('');
      setSelectedImage(null);
      fetchChatHistory(); // Atualiza histórico
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <main className="flex-1 flex w-full max-w-[1400px] mx-auto px-2 md:px-4 pt-20 pb-8 gap-4 relative">
        {/* Responsive Sidebar */}
        <aside 
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            transition-transform duration-300
            fixed md:relative
            top-0 left-0 z-40
            w-3/4 sm:w-80 md:w-64
            h-screen md:h-[80vh]
            bg-gray-50 border-r rounded-r-xl md:rounded-xl
            overflow-y-auto shadow-lg md:shadow-sm
            mt-16 md:mt-0
          `}
        >
          <div className="p-4 border-b flex items-center gap-2 font-semibold text-gray-700">
            <History size={20} />
            Histórico
          </div>
          <div className="p-4 space-y-2">
            {history.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma conversa salva.</p>
            )}
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="block w-full text-left p-2 bg-white hover:bg-gray-100 text-sm rounded-lg border text-gray-700 truncate"
                title={item.content}
              >
                {item.role === 'user' ? '🧑 ' : '🤖 '}
                {item.content.slice(0, 50)}
              </button>
            ))}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl shadow-lg overflow-hidden min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 space-y-4">
            {messages.length === 0 && !isLoading && (
              <p className="text-center text-gray-400 mt-32">Comece a conversa digitando uma pergunta...</p>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border rounded-bl-none'
                  }`}
                >
                  {msg.image && <img src={msg.image} alt="Preview" className="mb-2 rounded-lg" />}
                  {msg.content}
                  {msg.role === 'assistant' && msg.meta && (
                    <div className="mt-2 text-[10px] text-gray-400">
                      Em {msg.meta.ms}ms • {msg.meta.model}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white rounded-2xl border">
                  <div className="flex space-x-1 animate-bounce">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t bg-white p-2 sm:p-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-gray-500 hover:text-blue-600 p-2"
              >
                <ImageIcon size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (!message.trim() && !selectedImage)}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
              >
                <Send size={20} />
              </button>
            </div>
            {selectedImage && (
              <div className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center gap-2 px-2">
                <ImageIcon size={16} />
                <span className="truncate">{selectedImage.name}</span>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default withProtectedRoute(AIChat);
