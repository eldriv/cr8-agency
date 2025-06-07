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
    DEVELOPMENT: 'http://localhost:3002', // FIXED: Changed from 3002 to match backend
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
    () => CONFIG.API.getApiBase() + API_CONFIG.ENDPOINTS.TRAINING_DATA,
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

// FIXED: Enhanced UTILS with better training data fetching
export const UTILS = {
  // Enhanced fetch with better error handling
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
          'Accept': 'application/json, text/plain', // FIXED: Prioritize JSON first
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
          const backoffDelay = delay * Math.pow(2, attempt - 1);
          console.log(`⏳ Waiting ${backoffDelay}ms before retry...`);
          await UTILS.sleep(backoffDelay);
        }
      }
    }
    
    console.log('❌ All retry attempts failed');
    throw lastError;
  },

  // Sleep utility
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // FIXED: Enhanced training data fetching with proper error handling
  fetchTrainingData: async () => {
    console.log('📚 Starting training data fetch...');
    
    // Get training data paths (resolve function if needed)
    const paths = CONFIG.TRAINING_DATA_PATHS.map(path => 
      typeof path === 'function' ? path() : path
    );
    
    console.log('📋 Training data paths to try:', paths);
    
    for (const path of paths) {
      try {
        console.log(`Fetching training data from: ${path}`);
        
        const response = await UTILS.fetchWithTimeout(path, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain' // FIXED: Prioritize JSON first
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch training data from ${path}: ${response.status}`);
        }
        
        // Try to get content as JSON first, then text
        let content;
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          const data = await response.json();
          // FIXED: Handle the correct backend response format
          content = data.content || data.data || data.text || JSON.stringify(data);
        } else {
          content = await response.text();
        }
        
        if (content && content.trim()) {
          console.log('✅ Training data loaded successfully from:', path);
          console.log('📊 Content length:', content.length);
          return content;
        } else {
          throw new Error('Empty content received');
        }
        
      } catch (error) {
        console.log(`Error fetching training data: ${error.message}`);
        continue; // Try next path
      }
    }
    
    // If all paths fail, use default training data
    console.log('⚠️ Using default training data as fallback');
    return CONFIG.DEFAULT_TRAINING_DATA;
  },

  // FIXED: Prompt template usage
  formatPrompt: (userPrompt, trainingData = '') => {
    try {
      // PROMPT_TEMPLATE is a string, not a function
      let prompt = PROMPT_TEMPLATE;
      
      // Replace placeholder with actual user prompt
      prompt = prompt.replace('{prompt}', userPrompt || 'Hello');
      
      // Add training data context if available
      if (trainingData && trainingData.trim()) {
        prompt = `${trainingData}\n\n${prompt}`;
      }
      
      return prompt;
    } catch (error) {
      console.error('❌ Error formatting prompt:', error);
      // Fallback prompt
      return `You are CR8, an AI assistant for a creative digital agency. User: ${userPrompt}`;
    }
  },

  // FIXED: Enhanced API call with correct response parsing
  callAPI: async (prompt, trainingData = '') => {
    try {
      console.log('🚀 Making API call...');
      
      const apiBase = CONFIG.API.getApiBase();
      const endpoints = CONFIG.API.getEndpoints(apiBase);
      
      console.log('🔗 API Base:', apiBase);
      console.log('🔗 Chat endpoint:', endpoints.BACKEND_PROXY);
      
      // Format the prompt properly
      const formattedPrompt = UTILS.formatPrompt(prompt, trainingData);
      
      // FIXED: Send only what the backend expects
      const requestBody = {
        prompt: formattedPrompt
      };
      
      console.log('📤 Request body:', {
        ...requestBody,
        prompt: requestBody.prompt.substring(0, 200) + '...' // Log truncated prompt
      });
      
      const response = await UTILS.fetchWithTimeout(endpoints.BACKEND_PROXY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📥 API response received:', {
        hasCandidates: !!data.candidates,
        candidatesLength: data.candidates?.length || 0,
        source: data.source || 'unknown'
      });
      
      // FIXED: Handle the correct response format from your backend
      let responseText = '';
      
      if (data.candidates && data.candidates.length > 0) {
        // Extract text from the Gemini-style response format
        responseText = data.candidates[0]?.content?.parts?.[0]?.text;
      } else if (data.response) {
        // Fallback: if backend changes to use 'response' property
        responseText = data.response;
      } else if (data.text) {
        // Another fallback format
        responseText = data.text;
      }
      
      if (!responseText || !responseText.trim()) {
        console.warn('⚠️ Empty response from API');
        return 'I received an empty response. Could you try asking your question again?';
      }
      
      console.log('✅ Response extracted successfully:', {
        length: responseText.length,
        preview: responseText.substring(0, 100) + '...'
      });
      
      return responseText;
      
    } catch (error) {
      console.error('❌ API call error:', error);
      
      // Return user-friendly error messages
      if (error.message.includes('timeout')) {
        return 'The request took too long to process. Please try again.';
      } else if (error.message.includes('fetch')) {
        return 'Unable to connect to the server. Please check your internet connection.';
      } else {
        return `I encountered an error: ${error.message}. Please try again.`;
      }
    }
  },

  // Health check utility
  checkBackendHealth: async () => {
    try {
      const apiBase = CONFIG.API.getApiBase();
      const endpoints = CONFIG.API.getEndpoints(apiBase);
      
      console.log(`Checking backend connection at: ${endpoints.HEALTH_CHECK}`);
      
      const response = await UTILS.fetchWithTimeout(endpoints.HEALTH_CHECK, {
        method: 'GET',
        timeout: 10000 // Shorter timeout for health check
      });
      
      console.log(`Health check response: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        return { status: 'healthy', data };
      } else {
        return { status: 'unhealthy', error: `HTTP ${response.status}` };
      }
      
    } catch (error) {
      console.log('Health check failed:', error.message);
      return { status: 'error', error: error.message };
    }
  },

  // Utility to validate configuration
  validateConfig: () => {
    const issues = [];
    
    // Check if PROMPT_TEMPLATE is properly defined
    if (typeof PROMPT_TEMPLATE !== 'string') {
      issues.push('PROMPT_TEMPLATE should be a string');
    }
    
    // Check API configuration
    if (!CONFIG.API.getApiBase()) {
      issues.push('API base URL not configured');
    }
    
    // Check training data paths
    if (!CONFIG.TRAINING_DATA_PATHS || CONFIG.TRAINING_DATA_PATHS.length === 0) {
      issues.push('No training data paths configured');
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ Configuration issues:', issues);
      return { valid: false, issues };
    }
    
    console.log('✅ Configuration validation passed');
    return { valid: true, issues: [] };
  }
};

// Initialize and validate configuration on load
(() => {
  console.log('🏗️ Initializing CR8 Configuration...');
  
  // Validate configuration
  const validation = UTILS.validateConfig();
  if (!validation.valid) {
    console.error('❌ Configuration validation failed:', validation.issues);
  }
  
  // Log environment info
  console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('🔗 API Base:', CONFIG.API.getApiBase());
  console.log('📱 App Version:', CONFIG.APP.VERSION);
  
  console.log('✅ CR8 Configuration initialized successfully');
})();

// Export for use in other modules
export default CONFIG;