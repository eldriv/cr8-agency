// config.js
export const CONFIG = {
  APP: {
    NAME: "KreiChat",
    MOBILE_NAME: "KreiChat Mobile",
    LOGO_PATH: "/logo.png",  // Adjust as needed
    LOGO_ALT: "KreiChat Logo",
  },

  API: {
    getApiBase: () => {
      if (window.location.hostname === "localhost") {
        return "http://localhost:3000"; // Local backend server
      }
      // Use Netlify or your production URL here
      return "https://cr8-agency.netlify.app/";
    },

    getEndpoints: (base) => ({
      BACKEND_PROXY: `${base}/chat`,
      HEALTH_CHECK: `${base}/health`,
    }),
  },

  FETCH: {
    HEADERS: {
      CONTENT_TYPE_JSON: "application/json",
      ACCEPT_JSON: "application/json",
    },
    TIMEOUT: 15000, // ms
  },

  STATUS: {
    CONNECTION: {
      UNKNOWN: "unknown",
      CONNECTED: "connected",
      OFFLINE: "offline",
    },
    TRAINING_DATA: {
      LOADING: "loading",
      LOADED: "loaded",
      FAILED: "failed",
      FALLBACK: "fallback",
    },
  },

  TRAINING_DATA_PATHS: [
    "/training-data.json",
    "/training-data.txt",
  ],

  DEFAULT_TRAINING_DATA: `This is a fallback default training data for KreiChat.`,

  MESSAGES: {
    WELCOME: {
      SUBTITLE_LOADED: "Hello! How can I help you today?",
      SUBTITLE_LOADING: "Loading data, please wait...",
    },
    NO_TRAINING_DATA: "Sorry, no training data available.",
    NO_RESPONSE: "Sorry, I couldn't generate a response.",
    DEFAULT_ERROR: "Oops! Something went wrong.",
    CONNECTION_ERROR: " Please check your internet connection.",
    RETRY_MESSAGE: " Please try again later.",
  },

  SUGGESTIONS: {
    GENERAL: [
      "What can you do?",
      "Tell me a joke.",
      "Help me with my account.",
    ],
    CR8_SPECIFIC: [
      "How does CR8 AI work?",
      "Show me CR8 features.",
    ],
    MOBILE_SPECIFIC: [
      "Mobile help",
      "Contact support",
    ],
  },

  UI: {
    ANIMATIONS: {
      TYPING_DELAY: {
        BASE: 50,
        RANDOM: 100,
      },
    },
  },
};

// Utility functions used in your ChatWidget
export const UTILS = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  fetchWithTimeout: async (resource, options = {}) => {
    const { timeout = 15000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(resource, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  },

  isValidTrainingData: (data) => typeof data === "string" && data.trim().length > 10,

  formatTime: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
};

// Your prompt builder for hybrid prompt (example)
export const PROMPT_TEMPLATE = {
  buildHybridPrompt: (userMessage, trainingData) => {
    return `
You are KreiChat AI assistant.
Use the following training data to help answer the user questions.

Training Data:
${trainingData}

User question:
${userMessage}

Answer in a friendly, concise manner:
`;
  },
};
