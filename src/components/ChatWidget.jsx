import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import trainingDataText from '../data/training.txt?raw';

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const TRAINING_DATA = trainingDataText;

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare the prompt with training data
      const prompt = `${TRAINING_DATA}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful response based on the training data above:`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      // Add AI response to chat
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      let errorMessage = 'Sorry, I encountered an error. ';
      if (error.message.includes('403')) {
        errorMessage += 'API key might be invalid or doesn\'t have proper permissions.';
      } else if (error.message.includes('429')) {
        errorMessage += 'Too many requests. Please try again later.';
      } else if (error.message.includes('400')) {
        errorMessage += 'Invalid request format.';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Network error - this might be due to CORS restrictions. Consider using a backend proxy.';
      } else {
        errorMessage += 'Please check your API key and try again.';
      }
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="text-white hover:bg-blue-700 p-1 rounded text-sm"
              >
                Clear
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                <Bot size={32} className="mx-auto mb-2 text-gray-400" />
                <p>Hello! I'm your AI assistant.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {message.role === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatbot;