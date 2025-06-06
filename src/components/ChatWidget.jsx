import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { CONFIG, UTILS, PROMPT_TEMPLATE } from '/backend/config';

const WelcomeMessage = ({ trainingDataStatus, setInputMessage, isMobile }) => (
  <div className="text-center p-8 space-y-6">
      <img 
      src={CONFIG.APP.LOGO_PATH} 
      alt={CONFIG.APP.LOGO_ALT} 
      className="w-40 h-30 mx-auto"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
    <h3 className="text-xl font-bold text-white">{CONFIG.APP.NAME}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {trainingDataStatus === 'loaded' ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADED :
       trainingDataStatus === 'loading' ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADING :
       trainingDataStatus === 'fallback' ? 'Using default information' : CONFIG.MESSAGES.NO_TRAINING_DATA}
    </p>
    <div className="flex flex-wrap gap-2 justify-center">
      {(isMobile ? (CONFIG.SUGGESTIONS.MOBILE_SPECIFIC || []) : [
        ...(CONFIG.SUGGESTIONS.CR8_SPECIFIC || []),
        ...(CONFIG.SUGGESTIONS.GENERAL || [])
      ]).map((suggestion, index) => (
        <button
          key={index}
          onClick={() => setInputMessage(suggestion)}
          className="px-4 py-4 text-xs bg-gray-800/60 hover:bg-white hover:text-black text-gray-300 rounded-full transition-all duration-200 backdrop-blur-sm border border-gray-700/50 hover:border-white"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const Message = ({ message, copyMessage }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
      message.role === 'user' 
        ? 'bg-white text-black shadow-lg' 
        : 'bg-gray-800/80 text-gray-100 backdrop-blur-sm border border-gray-700/50'
    }`}>
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {message.content}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs opacity-60">
          {UTILS.formatTime(message.timestamp)}
        </span>
        {message.role === 'assistant' && message.content && (
          <button
            onClick={() => copyMessage(message.content)}
            className="opacity-40 hover:opacity-80 transition-opacity p-1 rounded"
          >
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ChatHeader = ({ isMobile, connectionStatus, trainingDataStatus, chatHistory, restoreLastChat, clearChat, messages, toggleMinimize, isMinimized, toggleChat }) => (
  <div className={`flex items-center justify-between p-4 bg-black/90 backdrop-blur-xl border-b border-gray-800/60 ${isMobile ? 'relative z-[10000]' : ''}`}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-black border-2 border-white rounded-xl flex items-center justify-center">
        <MessageCircle size={18} className="text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white text-sm">{isMobile ? CONFIG.APP.MOBILE_NAME : CONFIG.APP.NAME}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connectionStatus === CONFIG.STATUS.CONNECTION.CONNECTED ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-400">
            {connectionStatus === CONFIG.STATUS.CONNECTION.CONNECTED ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-1">
      {chatHistory.length > 0 && (
        <button onClick={restoreLastChat} className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
          <RotateCcw size={16} className="text-gray-400" />
        </button>
      )}
      {messages.length > 0 && (
        <button onClick={clearChat} className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
          <Trash2 size={16} className="text-gray-400" />
        </button>
      )}
      {!isMobile && (
        <button onClick={toggleMinimize} className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
          {isMinimized ? <Maximize2 size={16} className="text-gray-400" /> : <Minimize2 size={16} className="text-gray-400" />}
        </button>
      )}
      <button onClick={toggleChat} className="p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
        <X size={16} className="text-gray-400" />
      </button>
    </div>
  </div>
);

const ChatInputArea = ({ inputRef, inputMessage, setInputMessage, handleKeyPress, isLoading, connectionStatus, sendMessage }) => (
  <div className="p-4 bg-black/90 backdrop-blur-xl border-t border-gray-800/60">
    <div className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full p-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
          rows="1"
          style={{ minHeight: '52px', maxHeight: '120px' }}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={sendMessage}
        disabled={isLoading || !inputMessage.trim()}
        className="h-[52px] px-4 bg-white hover:bg-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center"
      >
        <Send size={18} />
      </button>
    </div>
    {connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE && (
      <div className="mt-3 text-xs text-red-400 flex items-center space-x-2 bg-red-500/10 rounded-lg p-2 border border-red-500/20">
        <span>⚠️</span>
        <span>Backend server disconnected</span>
      </div>
    )}
  </div>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(CONFIG.STATUS.CONNECTION.UNKNOWN);
  const [trainingData, setTrainingData] = useState('');
  const [trainingDataStatus, setTrainingDataStatus] = useState(CONFIG.STATUS.TRAINING_DATA.LOADING);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = CONFIG.API.getApiBase();
  const ENDPOINTS = CONFIG.API.getEndpoints(API_BASE);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { loadTrainingData(); checkBackendConnection(); }, []);
  useEffect(() => {
    if (isOpen && !isMinimized && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const loadTrainingData = async () => {
    setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.LOADING);
    for (const path of CONFIG.TRAINING_DATA_PATHS) {
      try {
        const response = await UTILS.fetchWithTimeout(path, {
          method: 'GET',
          headers: { 'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON, 'Accept': CONFIG.FETCH.HEADERS.ACCEPT_JSON },
          timeout: CONFIG.FETCH.TIMEOUT,
        });
        if (!response.ok) throw new Error(`Failed to fetch training data from ${path}: ${response.status}`);
        const data = await response.text();
        if (UTILS.isValidTrainingData(data)) {
          setTrainingData(data);
          setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.LOADED);
          return;
        }
      } catch (error) { /* Continue to next path */ }
    }
    if (CONFIG.DEFAULT_TRAINING_DATA && UTILS.isValidTrainingData(CONFIG.DEFAULT_TRAINING_DATA)) {
      setTrainingData(CONFIG.DEFAULT_TRAINING_DATA);
      setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.FALLBACK);
      return;
    }
    setTrainingData(CONFIG.MESSAGES.NO_TRAINING_DATA);
    setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.FAILED);
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(ENDPOINTS.HEALTH_CHECK, {
        method: 'GET',
        headers: { 'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON },
      });
      setConnectionStatus(response.ok ? CONFIG.STATUS.CONNECTION.CONNECTED : CONFIG.STATUS.CONNECTION.OFFLINE);
    } catch (error) {
      setConnectionStatus(CONFIG.STATUS.CONNECTION.OFFLINE);
      setTimeout(checkBackendConnection, 5000);
    }
  };

  const typeMessage = async (message, callback) => {
    setIsTyping(true);
    const words = message.split(' ');
    let currentMessage = '';
    for (let i = 0; i < words.length; i++) {
      currentMessage += (i === 0 ? '' : ' ') + words[i];
      callback(currentMessage);
      await UTILS.sleep(CONFIG.UI.ANIMATIONS.TYPING_DELAY.BASE + Math.random() * CONFIG.UI.ANIMATIONS.TYPING_DELAY.RANDOM);
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

    const tempMessage = { role: 'assistant', content: '', timestamp: new Date(), isTyping: true };
    setMessages([...newMessages, tempMessage]);

    try {
      const prompt = PROMPT_TEMPLATE.buildHybridPrompt(userMessage, trainingData);
      const apiBase = CONFIG.API.getApiBase();
      const endpoints = CONFIG.API.getEndpoints(apiBase);

      const response = await fetch(endpoints.BACKEND_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         data.content?.parts?.[0]?.text || 
                         data.text || 
                         CONFIG.MESSAGES.NO_RESPONSE;

      setMessages(newMessages);
      const finalMessage = { role: 'assistant', content: '', timestamp: new Date() };
      setMessages([...newMessages, finalMessage]);

      await typeMessage(aiResponse, (partialMessage) => {
        setMessages([...newMessages, { ...finalMessage, content: partialMessage }]);
      });

      setConnectionStatus(CONFIG.STATUS.CONNECTION.CONNECTED);
    } catch (error) {
      let errorMessage = CONFIG.MESSAGES.DEFAULT_ERROR;
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += CONFIG.MESSAGES.CONNECTION_ERROR;
        setConnectionStatus(CONFIG.STATUS.CONNECTION.OFFLINE);
      } else {
        errorMessage += CONFIG.MESSAGES.RETRY_MESSAGE;
      }
      setMessages([...newMessages, { role: 'assistant', content: errorMessage, timestamp: new Date() }]);
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
    if (!isOpen) checkBackendConnection();
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const clearChat = () => {
    if (messages.length > 0) {
      setChatHistory([...chatHistory, { messages, timestamp: new Date() }]);
    }
    setMessages([]);
  };

  const copyMessage = (content) => {
    UTILS.copyToClipboard(content).catch(() => {});
  };

  const restoreLastChat = () => {
    if (chatHistory.length > 0) {
      const lastChat = chatHistory[chatHistory.length - 1];
      setMessages(lastChat.messages);
      setChatHistory(chatHistory.slice(0, -1));
    }
  };

  const ChatWindow = ({ isMobile }) => (
    <div className={`${isMobile ? 'fixed inset-0 z-[9999]' : `w-96 h-[600px] ${isMinimized ? 'h-16' : ''}`} bg-black/95 backdrop-blur-2xl border border-gray-800/60 ${isMobile ? '' : 'rounded-3xl'} shadow-2xl transition-all duration-300 flex flex-col overflow-hidden`}>
      <ChatHeader
        isMobile={isMobile}
        connectionStatus={connectionStatus}
        trainingDataStatus={trainingDataStatus}
        chatHistory={chatHistory}
        restoreLastChat={restoreLastChat}
        clearChat={clearChat}
        messages={messages}
        toggleMinimize={toggleMinimize}
        isMinimized={isMinimized}
        toggleChat={toggleChat}
      />

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {messages.length === 0 && (
              <WelcomeMessage
                trainingDataStatus={trainingDataStatus}
                setInputMessage={setInputMessage}
                isMobile={isMobile}
              />
            )}
            {messages.map((message, index) => (
              <Message key={index} message={message} copyMessage={copyMessage} />
            ))}
            {(isLoading || isTyping) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          <ChatInputArea
            inputRef={inputRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            connectionStatus={connectionStatus}
            sendMessage={sendMessage}
          />
        </>
      )}
    </div>
  );
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="group bg-black hover:bg-gray-900 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white backdrop-blur-sm"
          >
            <MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </button>
        )}
        {isOpen && <ChatWindow isMobile={false} />}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[9998] group bg-black hover:bg-gray-900 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white backdrop-blur-sm"
          >
            <MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </button>
        )}
        {isOpen && <ChatWindow isMobile={true} />}
      </div>
    </>
  );
};

export default ChatWidget;