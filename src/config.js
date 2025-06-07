// Fixed config.js - Comprehensive configuration with error handling

// Environment detection
const isDevelopment = typeof window !== 'undefined' && (
  process.env.NODE_ENV === 'development' || 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

// API Configuration
const API_CONFIG = {
  BACKEND_URLS: {
    PRODUCTION: 'https://cr8-backend.onrender.com',
    DEVELOPMENT: 'http://localhost:3002',
    FALLBACK: 'https://cr8-backend.onrender.com'
  },
  
  ENDPOINTS: {
    HEALTH: '/api/health',
    CHAT: '/api/chat',
    TRAINING_DATA: '/api/training-data',
    DEBUG: '/api/debug'
  }
};

// FIXED: PROMPT_TEMPLATE as string (not function)
export const PROMPT_TEMPLATE = `You are CR8, an AI assistant for a creative digital agency. You are helpful, creative, professional, and knowledgeable about marketing, branding, design, video editing, motion graphics, and business strategy.

About CR8:
- Digital creative agency specializing in graphic design, video editing, motion graphics, and animation
- Tagline: "Let's Create & Unleash Your Creative Vision"
- Contact: creativscr8@gmail.com, eldriv@proton.me
- Portfolio: https://cr8-agency.netlify.app/#works

Services:
- Graphic Design
- Video Editing  
- Motion Graphics
- Animation
- Logo Animation

Service Packages:
- LOE 1: Basic Short Form Video (30s–1m), Basic Long Form Video (5m–10m), Basic Motion Graphics
- LOE 2: Standard Short Form Video (30s–1m), Long Form Video (5m–20m), Motion Graphics with Intro Animation
- LOE 3: Advanced Video Editing with VFX, Template Creation, Full Motion Graphics

Production Process:
1. Understanding Your Brand
2. Drafting Storyboard (24–48 hours)
3. Production (12–72 hours)
4. Client Approval
5. Revision

Respond in a friendly, professional, and creative manner while staying true to CR8's brand and services.

User: {prompt}
CR8 Assistant:`;

// Main CONFIG object
export const CONFIG = {
  // Application settings
  APP: {
    NAME: 'CR8 AI Assistant',
    MOBILE_NAME: 'CR8 Chat',
    // Fix logo path issue - provide fallback
    LOGO_PATH: '/cr8-logo.png',
    LOGO_FALLBACK: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DUjg8L3RleHQ+Cjwvc3ZnPgo=',
    LOGO_ALT: 'CR8 Creative Agency Logo',
    VERSION: '1.0.0'
  },

  // API configuration
  API: {
    getApiBase: () => {
      if (isDevelopment) {
        return API_CONFIG.BACKEND_URLS.DEVELOPMENT;
      }
      return API_CONFIG.BACKEND_URLS.PRODUCTION;
    },
    
    getEndpoints: (baseUrl) => ({
      HEALTH_CHECK: `${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`,
      BACKEND_PROXY: `${baseUrl}${API_CONFIG.ENDPOINTS.CHAT}`,
      TRAINING_DATA: `${baseUrl}${API_CONFIG.ENDPOINTS.TRAINING_DATA}`,
      DEBUG: `${baseUrl}${API_CONFIG.ENDPOINTS.DEBUG}`
    })
  },

  // FIXED: Training data configuration - backend endpoint first
  TRAINING_DATA_PATHS: [
    // Use the backend endpoint as the primary source
    CONFIG?.API?.getApiBase ? CONFIG.API.getApiBase() + API_CONFIG.ENDPOINTS.TRAINING_DATA : 'https://cr8-backend.onrender.com/api/training-data',
    '/data/training-data.txt',
    '/assets/training-data.txt',
    '/training-data.txt'
  ],

  // Enhanced fetch configuration
  FETCH: {
    TIMEOUT: 30000,
    HEADERS: {
      CONTENT_TYPE_JSON: 'application/json',
      ACCEPT_JSON: 'application/json',
      USER_AGENT: 'ChatWidget/1.0.0'
    },
    RETRY: {
      MAX_ATTEMPTS: 3,
      DELAY: 1000
    }
  },

  // Default training data - comprehensive fallback
  DEFAULT_TRAINING_DATA: `# CR8 Digital Creative Agency - Training Data

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

## Creative Expertise
- Brand Identity Design
- Social Media Content
- Video Production
- Motion Graphics
- Animation Services
- Visual Storytelling
`,

  // UI Configuration
  UI: {
    ANIMATIONS: {
      TYPING_DELAY: {
        BASE: 30,
        RANDOM: 20
      },
      TRANSITIONS: {
        FADE: 300,
        SLIDE: 250,
        SCALE: 200
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
    },
    
    // Video configuration to prevent errors
    VIDEO: {
      PRELOAD: 'metadata', // Instead of 'auto' to reduce loading issues
      MUTED: true,
      AUTOPLAY: false, // Disable autoplay to prevent errors
      CONTROLS: false,
      LOOP: true,
      FALLBACK_ENABLED: true
    }
  },

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

  SUGGESTIONS: {
    GENERAL: [
      "What services does CR8 offer?",
      "Tell me about your pricing packages",
      "How does your creative process work?",
      "Can I see your portfolio?",
      "How can I contact CR8?"
    ],
    
    CR8_SPECIFIC: [
      "What are your video editing capabilities?",
      "Tell me about motion graphics services",
      "How do you handle brand projects?",
      "What's included in your packages?",
      "Can you help with logo animation?"
    ],
    
    MOBILE_SPECIFIC: [
      "Hi CR8! 👋",
      "Show me your work",
      "Pricing info?",
      "Contact details"
    ]
  },

  MESSAGES: {
    WELCOME: {
      SUBTITLE_LOADED: "I'm ready to help you unleash your creative vision with CR8's services!",
      SUBTITLE_LOADING: "Loading CR8 creative knowledge...",
      SUBTITLE_FALLBACK: "Ready to help with your creative projects"
    },
    
    NO_TRAINING_DATA: "I'm here to help with your creative needs! Ask me about CR8's services.",
    NO_RESPONSE: "I'm having trouble generating a response right now. Could you try rephrasing your creative question?",
    DEFAULT_ERROR: "I encountered an issue while processing your request. ",
    CONNECTION_ERROR: "It seems there's a connection problem with the server. Please check your internet connection and try again.",
    RETRY_MESSAGE: "Please try again, and if the problem persists, let me know!",
    
    LOADING: "Creating...",
    TYPING: "Crafting response...",
    
    ERRORS: {
      NETWORK: "Network error. Please check your connection and try again.",
      SERVER: "Server error. The creative service might be temporarily unavailable.",
      TIMEOUT: "Request timed out. Please try again.",
      UNKNOWN: "An unexpected error occurred. Please try again.",
      PROMPT_TEMPLATE: "Configuration error. Using fallback response system."
    }
  }
};

// Enhanced UTILS with better error handling
export const UTILS = {
  // Enhanced fetch with better error handling and debugging
  fetchWithTimeout: async (url, options = {}) => {
    const { timeout = CONFIG.FETCH.TIMEOUT, ...fetchOptions } = options;
    
    console.log('🔄 Fetching:', url);
    console.log('🔄 Options:', fetchOptions);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout for:', url);
      controller.abort();
    }, timeout);
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...fetchOptions.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('✅ Response received:', {
        url,
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.log('❌ Fetch error:', {
        url,
        error: error.message,
        name: error.name
      });
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  },

  // Enhanced retry with exponential backoff
  retry: async (fn, maxAttempts = CONFIG.FETCH.RETRY.MAX_ATTEMPTS, delay = CONFIG.FETCH.RETRY.DELAY) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxAttempts}`);
        return await fn();
      } catch (error) {
        lastError = error;
        console.log(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxAttempts) {
          const backoffDelay = delay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Waiting ${backoffDelay}ms before retry...`);
          await UTILS.sleep(backoffDelay);
        }
      }
    }
    
    console.log('❌ All retry attempts failed');
    throw lastError;
  },

  // Test connection to backend
  testConnection: async () => {
    const baseUrl = CONFIG.API.getApiBase();
    const endpoints = CONFIG.API.getEndpoints(baseUrl);
    
    try {
      console.log('🔍 Testing connection to:', endpoints.HEALTH_CHECK);
      const response = await UTILS.fetchWithTimeout(endpoints.HEALTH_CHECK, {
        method: 'GET',
        timeout: 10000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend connection successful:', data);
        return { success: true, data };
      } else {
        console.log('❌ Backend health check failed:', response.status);
        return { success: false, error: `Health check failed: ${response.status}` };
      }
    } catch (error) {
      console.log('❌ Backend connection failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Debug API configuration
  debugAPI: async () => {
    const baseUrl = CONFIG.API.getApiBase();
    const endpoints = CONFIG.API.getEndpoints(baseUrl);
    
    console.log('🔍 API Debug Info:', {
      isDevelopment,
      baseUrl,
      endpoints,
      environment: process.env.NODE_ENV
    });
    
    // Test debug endpoint if available
    try {
      const response = await UTILS.fetchWithTimeout(endpoints.DEBUG, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const debugData = await response.json();
        console.log('🔍 Backend debug info:', debugData);
        return debugData;
      }
    } catch (error) {
      console.log('ℹ️ Debug endpoint not available:', error.message);
    }
    
    return null;
  },

  // Format timestamp
  formatTime: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  },

  // Sleep utility
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Validate training data
  isValidTrainingData: (data) => {
    return data && typeof data === 'string' && data.trim().length > 0;
  }
};

// Export environment info
export const ENV = {
  isDevelopment,
  isProduction: !isDevelopment,
  apiBase: CONFIG.API.getApiBase()
};

export default CONFIG;