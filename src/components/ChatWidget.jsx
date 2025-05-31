import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle, Trash2, Minimize2, Maximize2, Copy, RotateCcw } from 'lucide-react';

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [trainingData, setTrainingData] = useState('');
  const [trainingDataStatus, setTrainingDataStatus] = useState('loading');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const BACKEND_PROXY_URL = 'http://localhost:3001/api/gemini';
  const HEALTH_CHECK_URL = 'http://localhost:3001/api/health';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadTrainingData();
  }, []);

  // Auto-focus input when chat opens (desktop only)
  useEffect(() => {
    if (isOpen && !isMinimized && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const loadTrainingData = async () => {
    const possiblePaths = [
      '/src/data/training.txt',
      './src/data/training.txt', 
      '../src/data/training.txt',
      '/data/training.txt',
      './data/training.txt',
      '../data/training.txt',
      '/training.txt',
      './training.txt',
      'src/data/training.txt',
      'data/training.txt',
      'training.txt'
    ];

    setTrainingDataStatus('loading');
    
    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        
        if (response.ok) {
          const data = await response.text();
          setTrainingData(data);
          setTrainingDataStatus('loaded');
          return;
        }
      } catch (error) {
        continue;
      }
    }
    
    setTrainingData('You are a helpful AI assistant. Please provide helpful and accurate responses.');
    setTrainingDataStatus('error');
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(HEALTH_CHECK_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const typeMessage = async (message, callback) => {
    setIsTyping(true);
    const words = message.split(' ');
    let currentMessage = '';
    
    for (let i = 0; i < words.length; i++) {
      currentMessage += (i === 0 ? '' : ' ') + words[i];
      callback(currentMessage);
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: new Date() }];
    setMessages(newMessages);
    setIsLoading(true);

    // Add temporary message for typing effect
    const tempMessage = { role: 'assistant', content: '', timestamp: new Date(), isTyping: true };
    setMessages([...newMessages, tempMessage]);

    try {
      const prompt = `${trainingData}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful response based on the training data above:`;

      const response = await fetch(BACKEND_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        timeout: 30000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      // Remove temp message and add real response with typing effect
      setMessages(newMessages);
      const finalMessage = { role: 'assistant', content: '', timestamp: new Date() };
      setMessages([...newMessages, finalMessage]);

      await typeMessage(aiResponse, (partialMessage) => {
        setMessages([...newMessages, { ...finalMessage, content: partialMessage }]);
      });

      setConnectionStatus('connected');
      
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Cannot connect to the backend server.';
        setConnectionStatus('disconnected');
      } else {
        errorMessage += 'Please try again.';
      }
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date()
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
    if (!isOpen) {
      checkBackendConnection();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    if (messages.length > 0) {
      setChatHistory([...chatHistory, { messages, timestamp: new Date() }]);
    }
    setMessages([]);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const restoreLastChat = () => {
    if (chatHistory.length > 0) {
      const lastChat = chatHistory[chatHistory.length - 1];
      setMessages(lastChat.messages);
      setChatHistory(chatHistory.slice(0, -1));
    }
  };

  const ConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className="flex items-center text-green-400 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          Connected
        </div>
      );
    } else if (connectionStatus === 'disconnected') {
      return (
        <div className="flex items-center text-red-400 text-xs">
          <AlertCircle size={12} className="mr-1" />
          Offline
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-400 text-xs">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        Unknown
      </div>
    );
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Mobile styles */}
      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 2px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #000000;
        }
      `}</style>

      {/* Desktop positioning */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50">
        {/* Floating Action Button - Desktop */}
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="group bg-black hover:bg-gray-900 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-800"
          >
            <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          </button>
        )}

        {/* Chat Window - Desktop */}
        {isOpen && (
          <div className={`bg-black border border-gray-800 rounded-xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
          } flex flex-col overflow-hidden`}>
            
            {/* Header */}
            <div className="bg-black text-white p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot size={24} className="text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                </div>
                <div>
                  <span className="font-bold text-lg">AI Assistant</span>
                  <div className="flex items-center space-x-3">
                    <ConnectionStatus />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {chatHistory.length > 0 && (
                  <button
                    onClick={restoreLastChat}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                    title="Restore last chat"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={clearChat}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                  title="Clear chat"
                  disabled={messages.length === 0}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={toggleMinimize}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-gray-300 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages and Input for Desktop */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {messages.length === 0 && (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="relative mb-4">
                        <Bot size={48} className="mx-auto text-gray-400" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">Welcome to CR8 AI Assistant</h3>
                      <p className="text-gray-400 text-sm mb-4">I'm here to help you with any questions.</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button 
                          onClick={() => setInputMessage("What is CR8?")}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-full text-sm transition-all duration-200 border border-gray-600"
                        >
                          What is CR8?
                        </button>
                        <button 
                          onClick={() => setInputMessage("What are the services CR8 can offer?")}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-full text-sm transition-all duration-200 border border-gray-600"
                        >
                          What are the services CR8 can offer? 
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex group ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                          message.role === 'user'
                            ? 'bg-white text-black'
                            : 'bg-gray-900 text-white border border-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                          )}
                          {message.role === 'user' && (
                            <User size={16} className="mt-1 flex-shrink-0 text-gray-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content}
                              {message.isTyping && <span className="animate-pulse">|</span>}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-60">
                                {formatTime(message.timestamp)}
                              </span>
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-600 p-1 rounded"
                                title="Copy message"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(isLoading || isTyping) && (
                    <div className="flex justify-start animate-slide-up">
                      <div className="bg-gray-900 text-white px-4 py-3 rounded-2xl border border-gray-800">
                        <div className="flex items-center space-x-2">
                          <Bot size={16} className="text-gray-400" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Desktop */}
                <div className="border-t border-gray-800 p-4 bg-black">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-200 placeholder-gray-400"
                        disabled={isLoading || connectionStatus === 'disconnected'}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {inputMessage.length}/500
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim() || connectionStatus === 'disconnected'}
                      className="bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl group"
                    >
                      <Send size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Press Enter to send • Shift + Enter for new line
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Floating Action Button - Mobile */}
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 z-50 group bg-black hover:bg-gray-900 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-800"
          >
            <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          </button>
        )}

        {/* Full Screen Chat - Mobile */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header - Mobile */}
            <div className="bg-black text-white p-4 border-b border-gray-800 flex justify-between items-center safe-area-top">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot size={24} className="text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                </div>
                <div>
                  <span className="font-bold text-lg">AI Assistant</span>
                  <div className="flex items-center space-x-3">
                    <ConnectionStatus />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {chatHistory.length > 0 && (
                  <button
                    onClick={restoreLastChat}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                    title="Restore last chat"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={clearChat}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                  title="Clear chat"
                  disabled={messages.length === 0}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="text-gray-300 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area - Mobile */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {messages.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="relative mb-4">
                    <Bot size={48} className="mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Welcome to CR8 AI Assistant</h3>
                  <p className="text-gray-400 text-sm mb-4">I'm here to help you with any questions.</p>
                  <div className="flex flex-col space-y-2 max-w-xs mx-auto">
                    <button 
                      onClick={() => setInputMessage("What is CR8?")}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm transition-all duration-200 border border-gray-600"
                    >
                      What is CR8?
                    </button>
                    <button 
                      onClick={() => setInputMessage("What are the services CR8 can offer?")}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm transition-all duration-200 border border-gray-600"
                    >
                      What are the services CR8 can offer? 
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex group ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                      message.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-gray-900 text-white border border-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                      )}
                      {message.role === 'user' && (
                        <User size={16} className="mt-1 flex-shrink-0 text-gray-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                          {message.isTyping && <span className="animate-pulse">|</span>}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-60">
                            {formatTime(message.timestamp)}
                          </span>
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-600 p-1 rounded"
                            title="Copy message"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(isLoading || isTyping) && (
                <div className="flex justify-start animate-slide-up">
                  <div className="bg-gray-900 text-white px-4 py-3 rounded-2xl border border-gray-800">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-gray-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Mobile */}
            <div className="border-t border-gray-800 p-4 bg-black safe-area-bottom">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-200 placeholder-gray-400"
                    disabled={isLoading || connectionStatus === 'disconnected'}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim() || connectionStatus === 'disconnected'}
                  className="bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl group flex-shrink-0"
                >
                  <Send size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send • Shift + Enter for new line
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GeminiChatbot;