import React from 'react';
import { Bot, X, Trash2, Minimize2, Maximize2, RotateCcw, Send } from 'lucide-react';
import { CONFIG } from '/backend/config';
import { ConnectionStatus, TrainingDataStatus } from './ChatInterface';

export const ChatHeader = ({ 
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
  return (
    <div className="bg-black text-white p-4 border-b border-gray-800 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Bot size={24} className="text-white" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
        </div>
        <div>
          <span className="font-bold text-lg">
            {isMobile ? CONFIG.APP.MOBILE_NAME : CONFIG.APP.NAME}
          </span>
          <div className="flex items-center space-x-3">
            <ConnectionStatus connectionStatus={connectionStatus} />
            <TrainingDataStatus trainingDataStatus={trainingDataStatus} />
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
        {!isMobile && (
          <button
            onClick={toggleMinimize}
            className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        )}
        <button
          onClick={toggleChat}
          className="text-gray-300 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const ChatInputArea = ({ 
  isMobile, 
  inputRef, 
  inputMessage, 
  setInputMessage, 
  handleKeyPress, 
  isLoading, 
  connectionStatus, 
  sendMessage 
}) => {
  return (
    <div className={`border-t border-gray-800 p-4 bg-black ${isMobile ? 'pb-8' : ''}`}>
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMobile ? CONFIG.MESSAGES.PLACEHOLDERS.MOBILE : CONFIG.MESSAGES.PLACEHOLDERS.DESKTOP}
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
        {isMobile ? 'Press Enter to send • Shift + Enter for new line' : 'Press Enter to send'}
      </div>
    </div>
  );
};

export const ChatStyles = () => {
  return (
    <style jsx>{`
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes typing-bounce {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
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

      .chat-window-desktop {
        width: 380px;
        height: 650px;
        min-width: 380px;
        min-height: 650px;
        max-width: 380px;
        max-height: 650px;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .chat-window-desktop.minimized {
        width: 320px;
        height: 56px;
        min-height: 56px;
        max-height: 56px;
        border-radius: 16px;
      }

      .messages-container {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        padding: 20px 16px;
        background: #000;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .messages-container::-webkit-scrollbar {
        width: 3px;
      }

      .messages-container::-webkit-scrollbar-track {
        background: transparent;
      }

      .messages-container::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 10px;
      }
    `}</style>
  );
};