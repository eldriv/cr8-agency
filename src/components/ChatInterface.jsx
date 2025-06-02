import React from 'react';
import { Copy, User, Bot, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ConnectionStatus = ({ connectionStatus }) => {
  const statusConfig = {
    connected: { color: 'text-green-400', icon: CheckCircle2, text: 'Connected' },
    disconnected: { color: 'text-red-400', icon: AlertCircle, text: 'Disconnected' },
    unknown: { color: 'text-yellow-400', icon: Loader2, text: 'Checking...' }
  };
  
  const { color, icon: Icon, text } = statusConfig[connectionStatus] || statusConfig.unknown;
  
  return (
    <div className={`flex items-center space-x-1 text-xs ${color}`}>
      <Icon size={12} className={connectionStatus === 'unknown' ? 'animate-spin' : ''} />
      <span>{text}</span>
    </div>
  );
};

export const TrainingDataStatus = ({ trainingDataStatus }) => {
  const statusConfig = {
    loaded: { color: 'text-green-400', icon: CheckCircle2, text: 'Ready' },
    loading: { color: 'text-yellow-400', icon: Loader2, text: 'Loading Data...' },
    fallback: { color: 'text-orange-400', icon: AlertCircle, text: 'General Mode' },
    error: { color: 'text-red-400', icon: AlertCircle, text: 'Data Error' }
  };
  
  const { color, icon: Icon, text } = statusConfig[trainingDataStatus] || statusConfig.loading;
  
  return (
    <div className={`flex items-center space-x-1 text-xs ${color}`}>
      <Icon size={12} className={trainingDataStatus === 'loading' ? 'animate-spin' : ''} />
      <span>{text}</span>
    </div>
  );
};

export const WelcomeMessage = ({ trainingDataStatus, setInputMessage }) => {
  const quickQuestions = [
    "What can you help me with?",
    "Tell me about CR8?",
    "What services do you offer?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="animate-slide-up p-6">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src="img/logo.png"
          alt="Bot Icon"
          className="h-12 w-12"
        />
        <div>
          <h3 className="text-xl font-bold text-white">AI Assistant</h3>
          <p className="text-gray-400 text-sm">
            {trainingDataStatus === 'loaded' 
              ? 'Ready to help with specialized knowledge'
              : trainingDataStatus === 'fallback'
              ? 'General assistant mode active'
              : 'Loading specialized knowledge...'}
          </p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6">
        I'm here to help! You can ask me questions, request assistance, or have a conversation.
      </p>

      <div className="space-y-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuickQuestion(question)}
            className="w-full text-center text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full p-4 text-gray-300 hover:text-white transition-all duration-200 hover:border-gray-500 hover:shadow-lg transform hover:scale-[1.02]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Message = ({ message, copyMessage }) => {
  const isUser = message.role === 'user';
  const isTyping = message.isTyping;
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    copyMessage(message.content);
  };

  return (
    <div className={`animate-slide-up flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-full`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-white text-black ml-2' : 'bg-gray-700 text-white mr-2'
        }`}>
          {isUser ? <User size={16} /> : <img src="img/logo.png" alt="Bot Icon" className="h-6 w-6" />}
        </div>
        
        <div className={`relative group ${isUser ? 'mr-2' : 'ml-2'}`}>
          <div className={`p-3 rounded-2xl ${
            isUser 
              ? 'bg-white text-black rounded-br-sm' 
              : 'bg-gray-800 text-white rounded-bl-sm border border-gray-700'
          } ${isTyping ? 'animate-pulse' : ''}`}>
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content || (isTyping ? 'Thinking...' : '')}
            </div>
            
            {message.timestamp && !isTyping && (
              <div className={`text-xs mt-2 ${isUser ? 'text-gray-600' : 'text-gray-400'}`}>
                {formatTimestamp(message.timestamp)}
              </div>
            )}
          </div>
          
          {!isUser && !isTyping && message.content && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-700"
              title="Copy message"
            >
              <Copy size={12} className="text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="animate-slide-up flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white">
          <Bot size={16} />
        </div>
        
        <div className="p-4 rounded-2xl bg-gray-800 text-white rounded-bl-sm border border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-400">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};