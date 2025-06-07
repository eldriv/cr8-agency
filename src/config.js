// config.js - Configuration file for ChatWidget

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// API Configuration
const API_CONFIG = {
  // Backend URLs - Update these with your actual deployment URLs
  BACKEND_URLS: {
    PRODUCTION: 'https://your-render-app.onrender.com', // Replace with your Render URL
    DEVELOPMENT: 'http://localhost:3002', // Updated to match your port
    FALLBACK: 'https://your-render-app.onrender.com' // Fallback URL
  },
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/api/health',
    CHAT: '/api/chat',
    TRAINING_DATA: '/api/training-data'
  }
};

// App Configuration
export const CONFIG = {
  // Application settings
  APP: {
    NAME: 'CR8 AI Assistant',
    MOBILE_NAME: 'CR8 Chat',
    LOGO_PATH: '/cr8-logo.png', // Update with your CR8 logo path
    LOGO_ALT: 'CR8 Creative Agency Logo',
    VERSION: '1.0.0'
  },

  // API configuration
  API: {
    getApiBase: () => {
      // Auto-detect environment and return appropriate base URL
      if (isDevelopment) {
        return API_CONFIG.BACKEND_URLS.DEVELOPMENT;
      }
      return API_CONFIG.BACKEND_URLS.PRODUCTION;
    },
    
    getEndpoints: (baseUrl) => ({
      HEALTH_CHECK: `${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`,
      BACKEND_PROXY: `${baseUrl}${API_CONFIG.ENDPOINTS.CHAT}`,
      TRAINING_DATA: `${baseUrl}${API_CONFIG.ENDPOINTS.TRAINING_DATA}`
    })
  },

  // Training data paths (in order of preference)
  TRAINING_DATA_PATHS: [
    '/api/training-data', // Your backend endpoint
    '/training-data.txt',
    '/data/cr8-training-data.txt',
    '/assets/cr8-training-data.txt'
  ],

  // Default training data (fallback) - CR8 specific
  DEFAULT_TRAINING_DATA: `
# CR8 Digital Creative Agency - Training Data

## About CR8
CR8 is a digital creative agency that helps clients bring their creative vision to life through graphic design, video editing, animation, and motion graphics.

**Tagline**: Let's Create & Unleash Your Creative Vision.

## Contact Information
- Email: creativscr8@gmail.com
- Alternative Email: eldriv@proton.me
- Portfolio: https://cr8-agency.netlify.app/#works

## Services Offered
- Graphic Design
- Video Editing
- Motion Graphics
- Animation
- Logo Animation

## Target Audience
We serve clients who need visual storytelling and branding services. Our goal is to bring your vision to life with creative execution.

## Service Packages
### LOE 1: Basic Short Form Video (30s–1m), Basic Long Form Video (5m–10m), Basic Motion Graphic Elements
### LOE 2: Short Form Video (30s–1m), Long Form Video (5m–20m), Motion Graphics with Intro Animation
### LOE 3: Advanced Video Editing with VFX, Template Creation, Full Motion Graphics

## Why Brands Trust CR8
- Uphold the highest quality standards
- Align projects with brand identity
- Stay current with industry trends

## Production Process
1. Understanding Your Brand
2. Drafting Storyboard (24–48 hours)
3. Production (12–72 hours)
4. Client Approval
5. Revision
`,

  // UI Configuration
  UI: {
    ANIMATIONS: {
      TYPING_DELAY: {
        BASE: 30, // Base delay between words (ms)
        RANDOM: 20 // Random additional delay (ms)
      },
      TRANSITIONS: {
        FADE: 300, // Fade transition duration (ms)
        SLIDE: 250, // Slide transition duration (ms)
        SCALE: 200  // Scale transition duration (ms)
      }
    },
    
    THEMES: {
      DEFAULT: {
        PRIMARY: '#000000',
        SECONDARY: '#ffffff',
        ACCENT: '#6366f1',
        BACKGROUND: 'rgba(0, 0, 0, 0.95)',
        TEXT: '#ffffff',
        TEXT_SECONDARY: '#9ca3af'
      }
    }
  },

  // Status constants
  STATUS: {
    CONNECTION: {
      CONNECTED: 'connected',
      OFFLINE: 'offline',
      CONNECTING: 'connecting',
      UNKNOWN: 'unknown'
    },
    
    TRAINING_DATA: {
      LOADING: 'loading',
      LOADED: 'loaded',
      FAILED: 'failed',
      FALLBACK: 'fallback'
    }
  },

  // Fetch configuration
  FETCH: {
    TIMEOUT: 10000, // 10 seconds
    HEADERS: {
      CONTENT_TYPE_JSON: 'application/json',
      ACCEPT_JSON: 'application/json',
      USER_AGENT: 'ChatWidget/1.0.0'
    },
    RETRY: {
      MAX_ATTEMPTS: 3,
      DELAY: 1000 // 1 second
    }
  },

  // Suggestions for users
  SUGGESTIONS: {
    GENERAL: [
      "Hello! How can you help me?",
      "What can you do?",
      "Tell me a joke",
      "Help me with coding",
      "Explain something interesting"
    ],
    
    CR8_SPECIFIC: [
      "What are your capabilities?",
      "How do you work?",
      "Can you help with programming?",
      "What topics can we discuss?"
    ],
    
    MOBILE_SPECIFIC: [
      "Hi there!",
      "What's new?",
      "Quick question",
      "Help please"
    ]
  },

  // Messages
  MESSAGES: {
    WELCOME: {
      SUBTITLE_LOADED: "I'm ready to help you with questions, coding, creative tasks, and more!",
      SUBTITLE_LOADING: "Loading my knowledge base...",
      SUBTITLE_FALLBACK: "Running with basic configuration"
    },
    
    NO_TRAINING_DATA: "I'm here to help! Ask me anything.",
    NO_RESPONSE: "I'm having trouble generating a response right now. Could you try rephrasing your question?",
    DEFAULT_ERROR: "I encountered an issue while processing your request. ",
    CONNECTION_ERROR: "It seems there's a connection problem with the server. Please check your internet connection and try again.",
    RETRY_MESSAGE: "Please try again, and if the problem persists, let me know!",
    
    LOADING: "Thinking...",
    TYPING: "Typing...",
    
    ERRORS: {
      NETWORK: "Network error. Please check your connection and try again.",
      SERVER: "Server error. The service might be temporarily unavailable.",
      TIMEOUT: "Request timed out. Please try again.",
      UNKNOWN: "An unexpected error occurred. Please try again."
    }
  }
};

// Utility functions
export const UTILS = {
  // Format timestamp for display
  formatTime: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  },

  // Sleep utility for animations
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Validate training data
  isValidTrainingData: (data) => {
    return data && typeof data === 'string' && data.trim().length > 0;
  },

  // Copy text to clipboard
  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  },

  // Fetch with timeout
  fetchWithTimeout: async (url, options = {}) => {
    const { timeout = CONFIG.FETCH.TIMEOUT, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  // Retry utility
  retry: async (fn, maxAttempts = CONFIG.FETCH.RETRY.MAX_ATTEMPTS, delay = CONFIG.FETCH.RETRY.DELAY) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await UTILS.sleep(delay * attempt); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  },

  // Debounce utility
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle utility
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Prompt template builder
export const PROMPT_TEMPLATE = {
  buildHybridPrompt: (userMessage, trainingData = '') => {
    const systemPrompt = `
${trainingData}

## Current Context
You are an AI assistant having a conversation with a user. Respond helpfully, accurately, and conversationally.

## Instructions
- Provide clear, helpful responses
- Be friendly and professional
- Use examples when helpful
- Ask clarifying questions if needed
- Keep responses focused and relevant

## User Message:
${userMessage}

## Your Response:
`;
    
    return systemPrompt.trim();
  },

  buildSimplePrompt: (userMessage) => {
    return `User: ${userMessage}\n\nAssistant: `;
  }
};

// Feature flags
export const FEATURES = {
  TYPING_ANIMATION: true,
  MESSAGE_COPY: true,
  CHAT_HISTORY: true,
  AUTO_SCROLL: true,
  MOBILE_OPTIMIZED: true,
  DARK_MODE: true,
  RATE_LIMITING: true,
  ERROR_RECOVERY: true
};

// Development utilities
export const DEV = {
  LOG_LEVEL: isDevelopment ? 'debug' : 'error',
  MOCK_RESPONSES: isDevelopment,
  SHOW_DEBUG_INFO: isDevelopment,
  
  log: (level, message, data = null) => {
    if (isDevelopment) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] ${message}`, data || '');
    }
  }
};

// Export environment info
export const ENV = {
  isDevelopment,
  isProduction: !isDevelopment,
  apiBase: API_CONFIG.BACKEND_URLS[isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION']
};

// Default export
export default CONFIG;