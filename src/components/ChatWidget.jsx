import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { CONFIG, UTILS, PROMPT_TEMPLATE } from '@config';

const WelcomeMessage = ({ trainingDataStatus, setInputMessage, isMobile }) => (
  <div className="text-center p-8 space-y-6">
    <img src={CONFIG.APP.LOGO_PATH} alt={CONFIG.APP.LOGO_ALT} className="w-40 h-30 mx-auto" onError={(e) => { e.target.style.display = 'none'; }} />
    <h3 className="text-xl font-bold text-white">{CONFIG.APP.NAME}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {trainingDataStatus === 'loaded' ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADED :
       trainingDataStatus === 'loading' ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADING :
       trainingDataStatus === 'fallback' ? 'Using fallback CR8 info' : CONFIG.MESSAGES.NO_TRAINING_DATA}
    </p>
    <div className="flex flex-wrap gap-2 justify-center">
      {(isMobile ? CONFIG.SUGGESTIONS.MOBILE_SPECIFIC : [...CONFIG.SUGGESTIONS.CR8_SPECIFIC, ...CONFIG.SUGGESTIONS.GENERAL])
        .map((suggestion, index) => (
          <button key={index} onClick={() => setInputMessage(suggestion)} className="px-4 py-2 text-xs bg-gray-800/60 hover:bg-white hover:text-black text-gray-300 rounded-full border border-gray-700/50">
            {suggestion}
          </button>
        ))}
    </div>
  </div>
);

const Message = ({ message, copyMessage }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-white text-black shadow-lg' : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'}`}>
      <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs opacity-60">{UTILS.formatTime(message.timestamp)}</span>
        {message.role === 'assistant' && message.content && <button onClick={() => copyMessage(message.content)} className="opacity-40 hover:opacity-80 p-1 rounded"><Copy size={12} /></button>}
      </div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl px-4 py-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ChatHeader = ({ isMobile, connectionStatus, trainingDataStatus, chatHistory, restoreLastChat, clearChat, messages, toggleMinimize, isMinimized, toggleChat }) => (
  <div className={`flex items-center justify-between p-4 bg-black/90 border-b border-gray-800/60 ${isMobile ? 'relative z-[10000]' : ''}`}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-black border-2 border-white rounded-xl flex items-center justify-center"><MessageCircle size={18} className="text-white" /></div>
      <div>
        <h3 className="font-semibold text-white text-sm">{isMobile ? CONFIG.APP.MOBILE_NAME : CONFIG.APP.NAME}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-400">{connectionStatus === 'connected' ? 'Online' : 'Offline'}</span>
          <div className={`w-2 h-2 rounded-full ${trainingDataStatus === 'loaded' ? 'bg-blue-400' : trainingDataStatus === 'fallback' ? 'bg-yellow-400' : 'bg-red-400'}`} />
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-1">
      {chatHistory.length > 0 && <button onClick={restoreLastChat} className="p-2 hover:bg-gray-800/60 rounded-lg"><RotateCcw size={16} className="text-gray-400" /></button>}
      {messages.length > 0 && <button onClick={clearChat} className="p-2 hover:bg-gray-800/60 rounded-lg"><Trash2 size={16} className="text-gray-400" /></button>}
      {!isMobile && <button onClick={toggleMinimize} className="p-2 hover:bg-gray-800/60 rounded-lg">{isMinimized ? <Maximize2 size={16} className="text-gray-400" /> : <Minimize2 size={16} className="text-gray-400" />}</button>}
      <button onClick={toggleChat} className="p-2 hover:bg-gray-800/60 rounded-lg"><X size={16} className="text-gray-400" /></button>
    </div>
  </div>
);

const ChatInputArea = ({ inputRef, inputMessage, setInputMessage, handleKeyPress, isLoading, connectionStatus, sendMessage }) => (
  <div className="p-4 bg-black/90 border-t border-gray-800/60">
    <div className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea ref={inputRef} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="w-full p-4 bg-gray-900/80 border border-gray-700/60 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-white/50" rows="1" style={{ minHeight: '52px', maxHeight: '120px' }} disabled={isLoading} />
      </div>
      <button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} className="h-[52px] px-4 bg-white hover:bg-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-400 rounded-2xl transition-all duration-200 shadow-lg">
        <Send size={18} />
      </button>
    </div>
    {connectionStatus === 'offline' && <div className="mt-3 text-xs text-red-400 flex items-center space-x-2 bg-red-500/10 rounded-lg p-2 border border-red-500/20"><span>⚠️</span><span>Backend disconnected</span></div>}
  </div>
);

const ChatWidget = () => {
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

  const API_BASE = CONFIG.API.getApiBase();
  const ENDPOINTS = CONFIG.API.getEndpoints(API_BASE);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { loadTrainingData(); checkBackendConnection(); }, []);
  useEffect(() => { if (isOpen && !isMinimized && window.innerWidth > 768) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen, isMinimized]);

  const loadTrainingData = async () => {
    setTrainingDataStatus('loading');
    try {
      const response = await UTILS.fetchWithTimeout(ENDPOINTS.BACKEND_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }), // <- this change
        mode: 'cors'
      });      
      const data = await response.text();
      if (UTILS.isValidTrainingData(data)) {
        setTrainingData(data);
        setTrainingDataStatus('loaded');
      } else throw new Error('Invalid data');
    } catch (error) {
      console.error('Training data error:', error);
      if (CONFIG.DEFAULT_TRAINING_DATA && UTILS.isValidTrainingData(CONFIG.DEFAULT_TRAINING_DATA)) {
        setTrainingData(CONFIG.DEFAULT_TRAINING_DATA);
        setTrainingDataStatus('fallback');
      } else {
        setTrainingData(CONFIG.MESSAGES.NO_TRAINING_DATA);
        setTrainingDataStatus('failed');
      }
    }
  };

  const checkBackendConnection = async () => {
    try {
      const response = await UTILS.fetchWithTimeout(ENDPOINTS.HEALTH_CHECK, { method: 'GET', headers: { 'Content-Type': 'application/json' }, mode: 'cors' });
      setConnectionStatus(response.ok ? 'connected' : 'offline');
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('offline');
      setTimeout(checkBackendConnection, 5000);
    }
  };

  const typeMessage = async (message, callback) => {
    setIsTyping(true);
    const words = message.split(' ');
    let current = '';
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      callback(current);
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
      console.log('Sending to:', ENDPOINTS.BACKEND_PROXY, 'Body:', JSON.stringify({ prompt }));

      const response = await UTILS.fetchWithTimeout(ENDPOINTS.BACKEND_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        mode: 'cors'
      });

      console.log('Response status:', response.status, 'OK:', response.ok);
      if (!response.ok) {
        const text = await response.text();
        console.error('Non-OK response:', { status: response.status, text });
        throw new Error(`HTTP error! Status: ${response.status}, Text: ${text}`);
      }

      const data = await response.json();
      console.log('Parsed data:', data);

      const aiResponse = data.text || CONFIG.MESSAGES.NO_RESPONSE;
      setMessages(newMessages);
      const finalMessage = { role: 'assistant', content: '', timestamp: new Date() };
      setMessages([...newMessages, finalMessage]);

      await typeMessage(aiResponse, (partial) => setMessages([...newMessages, { ...finalMessage, content: partial }]));
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Send error:', error.message, error.stack);
      let errorMsg = CONFIG.MESSAGES.DEFAULT_ERROR;
      if (error.message.includes('fetch') || error.message.includes('timeout')) {
        errorMsg += CONFIG.MESSAGES.CONNECTION_ERROR;
        setConnectionStatus('offline');
      } else errorMsg += CONFIG.MESSAGES.RETRY_MESSAGE;
      setMessages([...newMessages, { role: 'assistant', content: errorMsg, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) { checkBackendConnection(); if (trainingDataStatus === 'failed') loadTrainingData(); }
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const clearChat = () => { if (messages.length > 0) setChatHistory([...chatHistory, { messages, timestamp: new Date() }]); setMessages([]); };

  const copyMessage = (content) => UTILS.copyToClipboard(content).catch(err => console.error('Copy failed:', err));

  const restoreLastChat = () => { if (chatHistory.length > 0) { const last = chatHistory.pop(); setMessages(last.messages); setChatHistory(chatHistory); } };

  const ChatWindow = ({ isMobile }) => (
    <div className={`${isMobile ? 'fixed inset-0 z-[9999]' : `w-96 h-[600px] ${isMinimized ? 'h-16' : ''}`} bg-black/95 border border-gray-800/60 ${isMobile ? '' : 'rounded-3xl'} shadow-2xl transition-all duration-300 flex flex-col overflow-hidden`}>
      <ChatHeader isMobile={isMobile} connectionStatus={connectionStatus} trainingDataStatus={trainingDataStatus} chatHistory={chatHistory} restoreLastChat={restoreLastChat} clearChat={clearChat} messages={messages} toggleMinimize={toggleMinimize} isMinimized={isMinimized} toggleChat={toggleChat} />
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
            {messages.length === 0 && <WelcomeMessage trainingDataStatus={trainingDataStatus} setInputMessage={setInputMessage} isMobile={isMobile} />}
            {messages.map((message, index) => <Message key={index} message={message} copyMessage={copyMessage} />)}
            {(isLoading || isTyping) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          <ChatInputArea inputRef={inputRef} inputMessage={inputMessage} setInputMessage={setInputMessage} handleKeyPress={handleKeyPress} isLoading={isLoading} connectionStatus={connectionStatus} sendMessage={sendMessage} />
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        {!isOpen && <button onClick={toggleChat} className="group bg-black hover:bg-gray-900 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white"><MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" /><div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></div></button>}
        {isOpen && <ChatWindow isMobile={false} />}
      </div>
      <div className="md:hidden">
        {!isOpen && <button onClick={toggleChat} className="fixed bottom-6 right-6 z-[9998] group bg-black hover:bg-gray-900 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white"><MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" /><div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></div></button>}
        {isOpen && <ChatWindow isMobile={true} />}
      </div>
    </>
  );
};

export default ChatWidget;