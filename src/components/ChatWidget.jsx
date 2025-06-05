import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { CONFIG, UTILS, PROMPT_TEMPLATE } from '/backend/config';

// Component definitions
const WelcomeMessage = ({ trainingDataStatus, setInputMessage, isMobile }) => (
  <div className="text-center p-6 space-y-4">
    <img 
      src={CONFIG.APP.LOGO_PATH} 
      alt={CONFIG.APP.LOGO_ALT} 
      className="w-32 h-24 mx-auto"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
    <h3 className="text-lg font-semibold text-white">{CONFIG.APP.NAME}</h3>
    <p className="text-gray-400 text-sm">
      {trainingDataStatus === 'loaded' 
        ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADED
        : trainingDataStatus === 'loading'
        ? CONFIG.MESSAGES.WELCOME.SUBTITLE_LOADING
        : trainingDataStatus === 'fallback'
        ? 'Using default CR8 information'
        : CONFIG.MESSAGES.NO_TRAINING_DATA}
    </p>
    <div className="flex flex-wrap gap-2 justify-center">
      {(isMobile ? (CONFIG.SUGGESTIONS.MOBILE_SPECIFIC || []) : [
        ...(CONFIG.SUGGESTIONS.CR8_SPECIFIC || []),
        ...(CONFIG.SUGGESTIONS.GENERAL || [])
      ]).map((suggestion, index) => (
        <button
          key={index}
          onClick={() => setInputMessage(suggestion)}
          className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const Message = ({ message, index, copyMessage }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] rounded-lg p-3 ${
      message.role === 'user' 
        ? 'bg-white text-black' 
        : 'bg-gray-800 text-gray-100'
    }`}>
      <div className="whitespace-pre-wrap break-words">
        {message.content}
      </div>
      <div className="flex items-center justify-between mt-2 space-x-2">
        <span className="text-xs opacity-70">
          {UTILS.formatTime(message.timestamp)}
        </span>
        {message.role === 'assistant' && message.content && (
          <button
            onClick={() => copyMessage(message.content)}
            className="opacity-50 hover:opacity-100 transition-opacity"
            title="Copy message"
          >
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex space-x-1">
        {CONFIG.UI.ANIMATIONS.BOUNCE_DELAYS.map((delay, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatHeader = ({ 
  isMobile, 
  connectionStatus, 
  trainingDataStatus, 
  chatHistory, 
  restoreLastChat, 
  clearChat, 
  messages, 
  toggleMinimize, 
  isMinimized, 
  toggleChat 
}) => {
  const ConnectionIndicator = () => (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        connectionStatus === CONFIG.STATUS.CONNECTION.CONNECTED ? 'bg-green-500' : 
        connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE ? 'bg-red-500' : 'bg-yellow-500'
      }`} />
      <span className="text-xs text-gray-400">
        {connectionStatus === CONFIG.STATUS.CONNECTION.CONNECTED ? 'Online' : 
         connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE ? 'Offline' : 'Checking...'}
      </span>
      {(trainingDataStatus === 'loaded' || trainingDataStatus === 'fallback') && (
        <span className="text-xs text-green-400">
          • {trainingDataStatus === 'loaded' ? 'Ready' : 'Using Default Data'}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <MessageCircle size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{isMobile ? CONFIG.APP.MOBILE_NAME : CONFIG.APP.NAME}</h3>
          <ConnectionIndicator />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {chatHistory.length > 0 && (
          <button
            onClick={restoreLastChat}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Restore last chat"
          >
            <RotateCcw size={16} className="text-gray-400" />
          </button>
        )}
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 size={16} className="text-gray-400" />
          </button>
        )}
        {!isMobile && (
          <button
            onClick={toggleMinimize}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} className="text-gray-400" /> : <Minimize2 size={16} className="text-gray-400" />}
          </button>
        )}
        <button
          onClick={toggleChat}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Close chat"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

const ChatInputArea = ({ 
  isMobile, 
  inputRef, 
  inputMessage, 
  setInputMessage, 
  handleKeyPress, 
  isLoading, 
  connectionStatus, 
  sendMessage 
}) => (
  <div className="p-4 bg-gray-900 border-t border-gray-700">
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isMobile ? CONFIG.MESSAGES.PLACEHOLDERS.MOBILE : CONFIG.MESSAGES.PLACEHOLDERS.DESKTOP}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="1"
          style={{ minHeight: '44px', maxHeight: '120px' }}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={sendMessage}
        disabled={isLoading || !inputMessage.trim()}
        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0"
        title="Send message"
      >
        <Send size={16} />
      </button>
    </div>
    {connectionStatus === CONFIG.STATUS.CONNECTION.OFFLINE && (
      <div className="mt-2 text-xs text-red-400 flex items-center space-x-1">
        <span>⚠️ Backend server disconnected. Please check your server.</span>
      </div>
    )}
  </div>
);

const ChatStyles = () => (
  <style>
    {`
      .chat-window-desktop {
        width: ${CONFIG.UI.FIXED_DIMENSIONS.DESKTOP.WIDTH};
        height: ${CONFIG.UI.FIXED_DIMENSIONS.DESKTOP.HEIGHT};
      }
      
      .chat-window-desktop.minimized {
        width: ${CONFIG.UI.FIXED_DIMENSIONS.DESKTOP.WIDTH};
        height: ${CONFIG.UI.FIXED_DIMENSIONS.DESKTOP.MINIMIZED_HEIGHT};
      }
      
      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      
      .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
        background-color: #4b5563;
        border-radius: 3px;
      }
      
      .scrollbar-track-gray-800::-webkit-scrollbar-track {
        background-color: #1f2937;
      }
      
      .message-wrapper {
        margin-bottom: 16px;
      }
      
      .typing-indicator {
        margin-bottom: 16px;
      }
      
      .input-area {
        border-top: 1px solid #374151;
      }
    `}
  </style>
);

// Main ChatWidget Component
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
    checkBackendConnection();
  }, []);

  // Auto-focus input when chat opens (desktop only)
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
          headers: {
            'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
            'Accept': CONFIG.FETCH.HEADERS.ACCEPT_JSON,
          },
          timeout: CONFIG.FETCH.TIMEOUT,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch training data from ${path}: ${response.status}`);
        }

        const data = await response.text();
        if (UTILS.isValidTrainingData(data)) {
          setTrainingData(data);
          setTrainingDataStatus(CONFIG.STATUS.TRAINING_DATA.LOADED);
          return;
        }
      } catch (error) {
        // Silently continue to next path
      }
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
        headers: {
          'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
        },
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

  // Updated sendMessage function for your ChatWidget component
// Replace the existing sendMessage function with this:

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
    
    // Use the full API endpoint URL
    const apiBase = CONFIG.API.getApiBase();
    const endpoints = CONFIG.API.getEndpoints(apiBase);

    const response = await fetch(endpoints.BACKEND_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': CONFIG.FETCH.HEADERS.CONTENT_TYPE_JSON,
      },
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
    UTILS.copyToClipboard(content).catch(() => {
      // Silently fail
    });
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
            className="group bg-black hover:bg-gray-900 text-white p-4 w-6 h-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-800"
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

export default ChatWidget;