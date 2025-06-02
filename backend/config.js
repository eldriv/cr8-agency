// config.js - Configuration constants for the chatbot

export const CONFIG = {
    // API Configuration
    API: {
      getApiBase: () => {
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          const protocol = window.location.protocol;
          
          // Local development
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001';
          }
          // Production
          return `${protocol}//${hostname}`;
        }
        return '';
      },
      
      getEndpoints: (apiBase) => ({
        BACKEND_PROXY: `${apiBase}/api/gemini`,
        HEALTH_CHECK: `${apiBase}/api/health`,
        TRAINING_DATA: `${apiBase}/api/training-data`
      })
    },
  
    // Training Data Paths
    TRAINING_DATA_PATHS: [
      '/data/training.txt',          // Most likely path for Vercel/Netlify
      '/training.txt',               // If file is directly in public folder
      './data/training.txt',         // Relative path fallback
      './training.txt',              // Relative path fallback
    ],
  
    // UI Configuration
    UI: {
      DESKTOP: {
        // Remove these Tailwind classes and use CSS classes instead
        CHAT_WIDTH: 'chat-window-desktop',
        CHAT_HEIGHT: 'chat-window-desktop', 
        MINIMIZED_HEIGHT: 'minimized',
        MINIMIZED_WIDTH: 'minimized'
      },
      
      MOBILE: {
        SAFE_AREA_TOP: 'safe-area-top',
        SAFE_AREA_BOTTOM: 'safe-area-bottom'
      },

      ANIMATIONS: {
        TYPING_DELAY: {
          BASE: 50,
          RANDOM: 50
        },
        BOUNCE_DELAYS: ['0.1s', '0.2s']
      },

      // Add fixed dimensions
      FIXED_DIMENSIONS: {
        DESKTOP: {
          WIDTH: '384px',
          HEIGHT: '600px',
          MINIMIZED_HEIGHT: '56px'
        }
      }
    },
    // Message Configuration
    MESSAGES: {
      DEFAULT_ERROR: 'Sorry, I encountered an error. ',
      CONNECTION_ERROR: 'Cannot connect to the backend server.',
      RETRY_MESSAGE: 'Please try again.',
      NO_RESPONSE: 'Sorry, I could not generate a response.',
      NO_TRAINING_DATA: 'No specific CR8 information available at this time.',
      
      PLACEHOLDERS: {
        DESKTOP: 'Ask about CR8 or any questions...',
        MOBILE: 'Type your message...'
      },
  
      WELCOME: {
        TITLE: 'AI Assistant',
        SUBTITLE_LOADED: "I can help with CR8 information and general questions.",
        SUBTITLE_LOADING: "I can answer general questions while CR8 data loads.",
        MOBILE_SUBTITLE: "I'm here to help you with any questions."
      }
    },
  
    // Suggestion Buttons
    SUGGESTIONS: {
      CR8_SPECIFIC: [
        "What is CR8?",
        "What services does CR8 offer?",
        "How can I contact CR8?"
      ],
      
      GENERAL: [
        "What is artificial intelligence?",
        "Tell me about web development",
        "How can AI help businesses?"
      ],
  
      MOBILE_SPECIFIC: [
        "What is CR8?",
        "What are the services CR8 can offer?"
      ]
    },
  
    // Status Messages
    STATUS: {
      CONNECTION: {
        CONNECTED: 'Connected',
        OFFLINE: 'Offline',
        UNKNOWN: 'Unknown'
      },
      
      TRAINING_DATA: {
        GENERAL_MODE: 'General Mode',
        LOADING: 'Loading...'
      }
    },
  
    // Fetch Configuration
    FETCH: {
      HEADERS: {
        ACCEPT_TEXT: 'text/plain',
        ACCEPT_JSON: 'application/json',
        CONTENT_TYPE_JSON: 'application/json',
        CACHE_CONTROL: 'no-cache'
      },
      
      MIN_CONTENT_LENGTH: 10
    },
  
    // App Information
    APP: {
      NAME: 'CR8 Assistant',
      MOBILE_NAME: 'AI Assistant',
      LOGO_PATH: 'img/logo.png',
      LOGO_ALT: 'Bot Icon'
    }
  };
  
  export const PROMPT_TEMPLATE = {
    buildHybridPrompt: (userMessage, trainingData) => {
      return `You are an AI assistant for CR8. Use the following information about CR8 when relevant:
  
  ${trainingData}
  
  User Question: ${userMessage}
  
  Instructions:
  1. If the question is specifically about CR8, use the training data above
  2. If it's a general question, provide helpful information from your knowledge
  3. Always maintain a professional, helpful tone.
  4. If unsure about CR8-specific details, clearly state limitations but don't mention that it's not in your training data. Make the user know that you're not biased and you're not depending on a training data.
  
  Please provide a helpful response:`;
    }
  };
  
  // Utility Functions
  export const UTILS = {
    formatTime: (timestamp) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
    copyToClipboard: (text) => {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
      }
      return Promise.reject('Clipboard API not available');
    }
  };