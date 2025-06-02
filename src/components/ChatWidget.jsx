import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { CONFIG, PROMPT_TEMPLATE, UTILS } from '/backend/config';
import { WelcomeMessage, Message, TypingIndicator } from '/src/components/ChatInterface';
import { ChatHeader, ChatInputArea, ChatStyles } from '/src/components/ChatLayout';

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

  // Get API configuration
  const API_BASE = CONFIG.API.getApiBase();
  const ENDPOINTS = CONFIG.API.getEndpoints(API_BASE);

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
    setTrainingDataStatus('loading');
    
    // Try each training data path
    for (const path of CONFIG.TRAINING_DATA_PATHS) {
      try {
        console.log(`Attempting to load training data from: ${path}`);
        
        const response = await fetch(path, {
          method: 'GET',
          headers: {
            'Accept': CONFIG.FETCH.HEADERS.ACCEPT_TEXT,
            'Cache-Control': CONFIG.FETCH.HEADERS.CACHE_CONTROL
          },
        });
        
        if (response.ok) {
          const data = await response.text();
          if (data && data.trim().length > CONFIG.FETCH.MIN_CONTENT_LENGTH) { 
            console.log(`✅ Successfully loaded training data from: ${path}`);
            console.log(`Training data length: ${data.length} characters`);
            setTrainingData(data);
            setTrainingDataStatus('loaded');
            return;
          } else {
            console.warn(`⚠️ Empty or too short content from ${path}`);
          }
        } else {
          console.warn(`❌ HTTP ${response.status} for ${path}`);
        }
      } catch (error) {
        console.warn(`❌ Failed to load from ${path}:`, error.message);
        continue;
      }
    }
    
    // Try API endpoint as backup
    try {
      console.log('Trying API endpoint for training data...');
      const response = await fetch(ENDPOINTS.TRAINING_DATA, {
        method: 'GET',
        headers: {
          'Accept': CONFIG.FETCH.HEADERS.ACCEPT_TEXT,
        },
      });
      
      if (response.ok) {
        const data = await response.text();
        if (data && data.trim().length > CONFIG.FETCH.MIN_CONTENT_LENGTH) {
          console.log('✅ Successfully loaded training data from API');
          setTrainingData(data);
          setTrainingDataStatus('loaded');
          return;
        }
      }
    } catch (error) {
      console.warn('❌ API endpoint also failed:', error.message);
    }

    // Fallback
    console.log('⚠️ No training data loaded, will answer general questions only');
    setTrainingData(CONFIG.MESSAGES.NO_TRAINING_DATA);
    setTrainingDataStatus('fallback');
  };

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(ENDPOINTS.HEALTH_CHECK, {
        method: 'GET',
        headers: {
          'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
        },
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Backend connection check failed:', error);
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

      const response = await fetch(ENDPOINTS.BACKEND_PROXY, {
        method: 'POST',
        headers: {
          'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || CONFIG.MESSAGES.NO_RESPONSE;

      setMessages(newMessages);
      const finalMessage = { role: 'assistant', content: '', timestamp: new Date() };
      setMessages([...newMessages, finalMessage]);

      await typeMessage(aiResponse, (partialMessage) => {
        setMessages([...newMessages, { ...finalMessage, content: partialMessage }]);
      });

      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Send message error:', error);
      let errorMessage = CONFIG.MESSAGES.DEFAULT_ERROR;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += CONFIG.MESSAGES.CONNECTION_ERROR;
        setConnectionStatus('disconnected');
      } else {
        errorMessage += CONFIG.MESSAGES.RETRY_MESSAGE;
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
    UTILS.copyToClipboard(content).catch(console.error);
  };

  const restoreLastChat = () => {
    if (chatHistory.length > 0) {
      const lastChat = chatHistory[chatHistory.length - 1];
      setMessages(lastChat.messages);
      setChatHistory(chatHistory.slice(0, -1));
    }
  };

  return (
    <>
      <ChatStyles />

      {/* Desktop Layout */}
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
          <div className={`chat-window-desktop ${isMinimized ? 'minimized' : ''} bg-black border border-gray-800 rounded-xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden`}>
            <div className="chat-header">
              <ChatHeader 
                isMobile={false}
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
            </div>

            {!isMinimized && (
              <>
                <div className="messages-container bg-black scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <WelcomeMessage 
                        trainingDataStatus={trainingDataStatus}
                        setInputMessage={setInputMessage}
                        isMobile={false}
                      />
                    )}
                    
                    {messages.map((message, index) => (
                      <div key={index} className="message-wrapper">
                        <Message 
                          message={message}
                          index={index}
                          copyMessage={copyMessage}
                        />
                      </div>
                    ))}
                    
                    {(isLoading || isTyping) && (
                      <div className="typing-indicator">
                        <TypingIndicator />
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                  <ChatInputArea 
                    isMobile={false}
                    inputRef={inputRef}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    handleKeyPress={handleKeyPress}
                    isLoading={isLoading}
                    connectionStatus={connectionStatus}
                    sendMessage={sendMessage}
                  />
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
            <ChatHeader 
              isMobile={true}
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {messages.length === 0 && (
                <WelcomeMessage 
                  trainingDataStatus={trainingDataStatus}
                  setInputMessage={setInputMessage}
                  isMobile={true}
                />
              )}
              
              {messages.map((message, index) => (
                <Message 
                  key={index}
                  message={message}
                  index={index}
                  copyMessage={copyMessage}
                />
              ))}
              
              {(isLoading || isTyping) && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <ChatInputArea 
              isMobile={true}
              inputRef={inputRef}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
              connectionStatus={connectionStatus}
              sendMessage={sendMessage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GeminiChatbot;