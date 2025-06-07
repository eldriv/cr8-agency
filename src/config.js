export const CONFIG = {
  API: {
    getApiBase: () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          // Local development backend
          return 'http://localhost:3002';
        }
        // Production backend URL from env var
        return process.env.REACT_APP_API_BASE || 'https://cr8-backend.onrender.com';
      }
      // fallback for SSR or build time
      return process.env.REACT_APP_API_BASE || 'https://cr8-backend.onrender.com';
    },

    getEndpoints: (apiBase) => ({
      BACKEND_PROXY: `${apiBase}/api/gemini`,
      HEALTH_CHECK: `${apiBase}/api/health`,
      TRAINING_DATA: `${apiBase}/api/training-data`,
      DIAGNOSE: `${apiBase}/api/diagnose`,
      VERSION: `${apiBase}/api/version`,
    }),
  },

  TRAINING_DATA_PATHS: [
    '/api/training-data',
    '/data/training.txt',
    '/training.txt',
  ],

  DEFAULT_TRAINING_DATA: `CR8 - Digital Solutions Company
We specialize in software development, AI research, and digital solutions for businesses.
Portfolio includes web apps, mobile apps, and AI-powered tools.
Contact us at contact@cr8.com`,

  UI: {
    DESKTOP: {
      CHAT_WIDTH: 'chat-window-desktop',
      CHAT_HEIGHT: 'chat-window-desktop',
      MINIMIZED_HEIGHT: 'minimized',
      MINIMIZED_WIDTH: 'minimized',
    },
    MOBILE: {
      SAFE_AREA_TOP: 'safe-area-top',
      SAFE_AREA_BOTTOM: 'safe-area-bottom',
    },
    ANIMATIONS: {
      TYPING_DELAY: {
        BASE: 50,
        RANDOM: 50,
      },
      BOUNCE_DELAYS: ['0.1s', '0.2s', '0.3s'],
    },
    FIXED_DIMENSIONS: {
      DESKTOP: {
        WIDTH: '384px',
        HEIGHT: '600px',
        MINIMIZED_HEIGHT: '56px',
      },
    },
  },

  MESSAGES: {
    DEFAULT_ERROR: 'Sorry, I encountered an error. ',
    CONNECTION_ERROR: 'Cannot connect to the backend server.',
    RETRY_MESSAGE: 'Please try again.',
    NO_RESPONSE: 'Sorry, I could not generate a response.',
    NO_TRAINING_DATA: 'Using general knowledge mode - specific CR8 data not available.',

    PLACEHOLDERS: {
      DESKTOP: 'Ask about CR8 or any questions...',
      MOBILE: 'Type your message...',
    },

    WELCOME: {
      TITLE: 'CR8 Assistant',
      SUBTITLE_LOADED: "I can help with CR8 information and general questions.",
      SUBTITLE_LOADING: "I can answer general questions while CR8 data loads.",
      MOBILE_SUBTITLE: "I'm here to help you with any questions.",
    },
  },

  SUGGESTIONS: {
    CR8_SPECIFIC: [
      "What is CR8?",
      "What services does CR8 offer?",
      "Tell me about CR8's portfolio",
    ],
    GENERAL: [],
    MOBILE_SPECIFIC: [
      "What is CR8?",
      "CR8 services?",
      "Contact CR8?",
      "CR8 portfolio?",
    ],
  },

  STATUS: {
    CONNECTION: {
      CONNECTED: 'connected',
      OFFLINE: 'offline',
      UNKNOWN: 'unknown',
    },
    TRAINING_DATA: {
      LOADED: 'loaded',
      LOADING: 'loading',
      FALLBACK: 'fallback',
      FAILED: 'failed',
    },
  },

  FETCH: {
    HEADERS: {
      ACCEPT_TEXT: 'text/plain',
      ACCEPT_JSON: 'application/json',
      CONTENT_TYPE_JSON: 'application/json',
    },
    MIN_CONTENT_LENGTH: 50,
    TIMEOUT: 20000,
    MAX_RETRIES: 3,
  },

  APP: {
    NAME: 'CR8 Assistant',
    MOBILE_NAME: 'CR8 AI',
    LOGO_PATH: '/img/logo.png',
    LOGO_ALT: 'CR8 Logo',
  },
};

export const PROMPT_TEMPLATE = {
  buildHybridPrompt: (userMessage, trainingData) => {
    const hasValidTrainingData =
      trainingData &&
      trainingData.trim().length > CONFIG.FETCH.MIN_CONTENT_LENGTH &&
      trainingData !== CONFIG.MESSAGES.NO_TRAINING_DATA;

    if (hasValidTrainingData) {
      return `You are an AI assistant for CR8. You MUST use the following information about CR8 EXCLUSIVELY when answering questions specifically about CR8. Do not rely on any external knowledge for CR8-related queries; use only the data provided below:

=== CR8 INFORMATION ===
${trainingData.trim()}
=== END CR8 INFORMATION ===

User Question: ${userMessage}

Instructions:
1. For questions specifically about CR8 (e.g., services, contact, portfolio, technologies, about CR8), base your answer ENTIRELY on the provided CR8 information above.
2. For general questions (e.g., about AI, web development, technology concepts), provide helpful information from your general knowledge.
3. Maintain a professional, helpful tone.
4. If the question is about CR8 and the data doesn't provide a complete answer, say: "Based on the available CR8 information, [provide what you can], but I don't have complete details about that specific aspect. Feel free to ask other questions!"
5. Always be concise but informative.

Please provide a helpful response:`;
    } else {
      return `You are a helpful AI assistant. The user asked: "${userMessage}"

I currently don't have access to specific CR8 company information, but I can help with general questions about technology, web development, AI, programming, and other topics.

If you're asking about CR8 specifically, I apologize that I don't have detailed information available right now. However, I can still help with:
- General technology questions
- Web development concepts
- Programming help
- AI and machine learning topics
- Business technology advice

Please provide a helpful response based on general knowledge:`;
    }
  },
};

// Basic utility functions
export const UTILS = {
  copyToClipboard: (text) => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error('Clipboard API not supported'));
  },

  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Add more utilities as needed
};
