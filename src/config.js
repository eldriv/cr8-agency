export const CONFIG = {
  API: {
    getApiBase: () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'http://localhost:3002';
        }

        // Production - Use environment variable or fallback to Render URL
        return process.env.REACT_APP_API_BASE || 'https://cr8-backend.onrender.com';
      }

      // Server-side rendering fallback
      return process.env.REACT_APP_API_BASE || 'https://cr8-backend.onrender.com';
    },

    getEndpoints: (apiBase) => ({
      BACKEND_PROXY: `${apiBase}/api/gemini`,
      HEALTH_CHECK: `${apiBase}/api/health`,
      TRAINING_DATA: `${apiBase}/api/training-data`,
      DIAGNOSE: `${apiBase}/api/diagnose`,
      VERSION: `${apiBase}/api/version`
    })
  },

  TRAINING_DATA_PATHS: [
    '/api/training-data',
    '/data/training.txt',
    '/training.txt'
  ],

  DEFAULT_TRAINING_DATA: `CR8 - Digital Solutions Company
... [your CR8 data remains unchanged here] ...`,

  UI: {
    DESKTOP: {
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
      BOUNCE_DELAYS: ['0.1s', '0.2s', '0.3s']
    },

    FIXED_DIMENSIONS: {
      DESKTOP: {
        WIDTH: '384px',
        HEIGHT: '600px',
        MINIMIZED_HEIGHT: '56px'
      }
    }
  },

  MESSAGES: {
    DEFAULT_ERROR: 'Sorry, I encountered an error. ',
    CONNECTION_ERROR: 'Cannot connect to the backend server.',
    RETRY_MESSAGE: 'Please try again.',
    NO_RESPONSE: 'Sorry, I could not generate a response.',
    NO_TRAINING_DATA: 'Using general knowledge mode - specific CR8 data not available.',

    PLACEHOLDERS: {
      DESKTOP: 'Ask about CR8 or any questions...',
      MOBILE: 'Type your message...'
    },

    WELCOME: {
      TITLE: 'CR8 Assistant',
      SUBTITLE_LOADED: "I can help with CR8 information and general questions.",
      SUBTITLE_LOADING: "I can answer general questions while CR8 data loads.",
      MOBILE_SUBTITLE: "I'm here to help you with any questions."
    }
  },

  SUGGESTIONS: {
    CR8_SPECIFIC: [
      "What is CR8?",
      "What services does CR8 offer?",
      "Tell me about CR8's portfolio"
    ],

    GENERAL: [],

    MOBILE_SPECIFIC: [
      "What is CR8?",
      "CR8 services?",
      "Contact CR8?",
      "CR8 portfolio?"
    ]
  },

  STATUS: {
    CONNECTION: {
      CONNECTED: 'connected',
      OFFLINE: 'offline',
      UNKNOWN: 'unknown'
    },

    TRAINING_DATA: {
      LOADED: 'loaded',
      LOADING: 'loading',
      FALLBACK: 'fallback',
      FAILED: 'failed'
    }
  },

  FETCH: {
    HEADERS: {
      ACCEPT_TEXT: 'text/plain',
      ACCEPT_JSON: 'application/json',
      CONTENT_TYPE_JSON: 'application/json'
    },

    MIN_CONTENT_LENGTH: 50,
    TIMEOUT: 20000,
    MAX_RETRIES: 3
  },

  APP: {
    NAME: 'CR8 Assistant',
    MOBILE_NAME: 'CR8 AI',
    LOGO_PATH: '/img/logo.png',
    LOGO_ALT: 'CR8 Logo'
  }
};

export const PROMPT_TEMPLATE = {
  buildHybridPrompt: (userMessage, trainingData) => {
    const hasValidTrainingData = trainingData &&
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
  }
};

export const UTILS = {
  formatTime: (timestamp) => {
    try {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  },

  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard successfully');
        return true;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          console.log('Text copied using fallback method');
          return true;
        } else {
          throw new Error('Copy command failed');
        }
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  },

  isValidTrainingData: (data) => {
    return data &&
      typeof data === 'string' &&
      data.trim().length > CONFIG.FETCH.MIN_CONTENT_LENGTH &&
      data.trim() !== CONFIG.MESSAGES.NO_TRAINING_DATA;
  },

  fetchWithTimeout: async (url, options = {}) => {
    const { timeout = CONFIG.FETCH.TIMEOUT, ...fetchOptions } = options;

    let fetchUrl = url;
    if (url.startsWith('/api/')) {
      const apiBase = CONFIG.API.getApiBase();
      fetchUrl = apiBase ? `${apiBase}${url}` : url;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log('Fetching with timeout:', fetchUrl);
      const response = await fetch(fetchUrl, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...fetchOptions.headers
        }
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

  debugConnection: async () => {
    const apiBase = CONFIG.API.getApiBase();
    const endpoints = CONFIG.API.getEndpoints(apiBase);

    console.log('🔍 Connection Debug:');
    console.log('API Base:', apiBase);
    console.log('Endpoints:', endpoints);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'Server-side');

    try {
      console.log('Testing health endpoint...');
      const healthResponse = await UTILS.fetchWithTimeout(endpoints.HEALTH_CHECK, {
        method: 'GET',
        timeout: 10000
      });

      console.log('Health check status:', healthResponse.status);

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Health data:', healthData);
      }

      console.log('Testing training data endpoint...');
      const trainingResponse = await UTILS.fetchWithTimeout(endpoints.TRAINING_DATA, {
        method: 'GET',
        timeout: 10000
      });

      console.log('Training data status:', trainingResponse.status);

      return {
        status: 'connected',
        apiBase,
        healthStatus: healthResponse.status,
        trainingDataStatus: trainingResponse.status
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        status: 'failed',
        apiBase,
        error: error.message
      };
    }
  },

  parseApiResponse: async (response) => {
    try {
      const contentType = response.headers.get('content-type');
      console.log('🔍 Response content-type:', contentType);
      console.log('🔍 Response status:', response.status);

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('🔍 Parsed JSON data:', data);

        if (data.response && typeof data.response === 'string') {
          console.log('✅ Found response field:', data.response.substring(0, 100) + '...');
          return data.response;
        } else if (data.trainingData && typeof data.trainingData === 'string') {
          console.log('✅ Found trainingData field');
          return data.trainingData;
        } else if (data.reply && typeof data.reply === 'string') {
          console.log('✅ Found reply field');
          return data.reply;
        } else if (typeof data === 'string' && data.trim().length > 0) {
          console.log('✅ Direct string response');
          return data;
        } else if (data.message && typeof data.message === 'string') {
          console.log('✅ Found message field');
          return data.message;
        } else {
          console.log('⚠️ Unexpected JSON structure, stringifying:', Object.keys(data));
          return JSON.stringify(data);
        }
      } else {
        console.log('📄 Parsing as plain text');
        const textResponse = await response.text();
        console.log('✅ Text response:', textResponse.substring(0, 100) + '...');
        return textResponse;
      }
    } catch (error) {
      console.error('❌ Error parsing API response:', error);
      try {
        const textResponse = await response.text();
        console.log('🔄 Fallback text parsing successful');
        return textResponse;
      } catch (textError) {
        console.error('❌ Error parsing as text:', textError);
        throw new Error('Unable to parse API response');
      }
    }
  },

  testApiResponse: async (testMessage = "What is CR8?") => {
    try {
      const apiBase = CONFIG.API.getApiBase();
      const endpoints = CONFIG.API.getEndpoints(apiBase);

      console.log('🧪 Testing API response with message:', testMessage);

      const response = await UTILS.fetchWithTimeout(endpoints.BACKEND_PROXY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are an AI assistant for CR8. User Question: ${testMessage}`
        })
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const parsedResponse = await UTILS.parseApiResponse(response);
        console.log('✅ Successfully parsed response:', parsedResponse);
        return { success: true, response: parsedResponse };
      } else {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        return { success: false, error: errorText, status: response.status };
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { success: false, error: error.message };
    }
  },

  debugApiCall: async () => {
    try {
      const apiBase = CONFIG.API.getApiBase();
      console.log('🔍 API Base:', apiBase);

      const url = `${apiBase}/api/gemini`;
      console.log('🔍 Full URL:', url);

      const testPayload = {
        prompt: "What is CR8?"
      };

      console.log('🔍 Sending payload:', testPayload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      console.log('🔍 Raw response status:', response.status);
      console.log('🔍 Raw response ok:', response.ok);

      const responseText = await response.text();
      console.log('🔍 Raw response text:', responseText);

      try {
        const responseJson = JSON.parse(responseText);
        console.log('🔍 Parsed JSON:', responseJson);

        if (responseJson.response) {
          console.log('✅ Found response field:', responseJson.response);
          return responseJson.response;
        } else {
          console.log('❌ No response field found');
          return null;
        }
      } catch (parseError) {
        console.log('❌ JSON parse error:', parseError);
        return null;
      }

    } catch (error) {
      console.error('❌ Debug call failed:', error);
      return null;
    }
  }
};
