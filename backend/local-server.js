import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://cr8-nine.vercel.app',
      'https://cr8-agency-production.up.railway.app'
    ];
    
    // Allow any Railway or Vercel domain
    if (origin.includes('railway.app') || 
        origin.includes('vercel.app') || 
        origin.includes('netlify.app') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow any localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // for legacy browser support
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Increase payload limit for larger requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Enhanced debug middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log('Origin:', req.get('Origin'));
  console.log('User-Agent:', req.get('User-Agent'));
  
  if (req.method === 'POST' && req.body) {
    console.log('Body keys:', Object.keys(req.body));
    if (req.body.prompt) {
      console.log('Prompt length:', req.body.prompt.length);
    }
  }
  
  next();
});

const TRAINING_DATA = `CR8 - Digital Solutions Company

CR8 is a digital creative agency that helps clients bring their creative vision to life through graphic design, video editing, animation, and motion graphics.
What's the tagline of CR8?
Let's Create & Unleash Your Creative Vision.
How can I contact CR8?
You can reach us via email at creativscr8@gmail.com or eldriv@proton.me
Where can I view CR8's portfolio?
You can view our portfolio here: https://cr8-nine.vercel.app/#works
What services does CR8 offer?
We offer the following creative services:
- Graphic Design
- Video Editing
- Motion Graphics
- Animation
- Logo Animation
Who does CR8 serve?
We serve clients who need visual storytelling and branding services. Our goal is to bring your vision to life with creative execution.
What is CR8's production process?
Our production process includes:
1. Understanding Your Brand – We exchange ideas to align with your vision.
2. Drafting Storyboard (24–48 hours) – We prepare and finalize a storyboard; changes during production may incur fees.
3. Production (12–72 hours) – Our team executes and reviews the project based on the approved storyboard.
4. Client Approval – Feedback is collected through Frame.io, with support available.
5. Revision – Revisions are made based on feedback. After 3 rounds, extra fees may apply.
What's included in the LOE 1 package?
LOE 1 includes:
- Basic Short Form Video (30s–1m)
- Basic Long Form Video (5m–10m)
- Basic Motion Graphic Elements (Lower Thirds)
What's included in the LOE 2 package?
LOE 2 includes:
- Short Form Video (30s–1m)
- Long Form Video (5m–20m)
- Motion Graphics (Lower Thirds, Intro Animation, Logo Animation)
What's included in the LOE 3 package?
LOE 3 includes:
- Advanced Video Editing with VFX
- Template Creation
- Full Motion Graphics (Lower Thirds, Intro Animation, Logo Animation)
Can I customize a package?
Yes! You can choose any combination of services from our packages to create a customized solution based on your needs.
Why do brands trust CR8?
Brands trust CR8 because we:
- Uphold the highest quality standards
- Align projects with brand identity
- Stay current with industry trends`;

// Root route with more info
app.get('/', (req, res) => {
  res.json({
    message: 'CR8 Backend Server',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/training-data',
      'POST /api/gemini',
      'GET /api/gemini',
      'GET /api/diagnose'
    ]
  });
});

// Enhanced health check
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    nodeVersion: process.version
  };
  
  res.status(200).json(health);
});

// Training data endpoint with proper headers
app.get('/api/training-data', (req, res) => {
  try {
    res.set({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Content-Length': Buffer.byteLength(TRAINING_DATA, 'utf8')
    });
    res.status(200).send(TRAINING_DATA);
  } catch (error) {
    console.error('Error serving training data:', error);
    res.status(500).json({ error: 'Failed to serve training data' });
  }
});

// Enhanced Gemini API helper with better error handling
const callGeminiAPI = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      stopSequences: []
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  console.log('Making request to Gemini API...');
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CR8-Backend/1.0'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('Gemini API response status:', response.status);
    
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Gemini API error response:', data);
      throw new Error(`Gemini API error: ${data.error?.message || `HTTP ${response.status}`}`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Gemini API request timeout');
    }
    throw error;
  }
};

// Main POST endpoint for /api/gemini
app.post('/api/gemini', async (req, res) => {
  console.log('POST /api/gemini - Request received');
  
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.error('Missing prompt in request body');
      return res.status(400).json({
        error: 'Prompt is required',
        received: req.body
      });
    }

    if (typeof prompt !== 'string') {
      console.error('Prompt must be a string');
      return res.status(400).json({
        error: 'Prompt must be a string',
        received: typeof prompt
      });
    }

    if (prompt.length > 10000) {
      console.error('Prompt too long');
      return res.status(400).json({
        error: 'Prompt too long (max 10000 characters)',
        length: prompt.length
      });
    }

    console.log(`Processing prompt of length: ${prompt.length}`);
    
    const data = await callGeminiAPI(prompt);
    
    // Enhanced response validation
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('No valid response from Gemini API:', data);
      return res.status(500).json({
        error: 'No valid response from AI service',
        details: data
      });
    }

    console.log('Successfully processed request');
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error in POST /api/gemini:', error.message);
    console.error('Stack trace:', error.stack);
    
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    
    if (error.message.includes('timeout')) {
      statusCode = 504;
      errorMessage = 'Gateway Timeout';
    } else if (error.message.includes('GEMINI_API_KEY')) {
      statusCode = 503;
      errorMessage = 'Service Configuration Error';
    } else if (error.message.includes('Gemini API error')) {
      statusCode = 502;
      errorMessage = 'AI Service Error';
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Keep GET endpoint for testing
app.get('/api/gemini', async (req, res) => {
  console.log('GET /api/gemini - Request received');
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      error: 'Prompt query parameter is required',
      example: '/api/gemini?prompt=Hello'
    });
  }

  try {
    const data = await callGeminiAPI(prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in GET /api/gemini:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// Enhanced diagnostics endpoint
app.get('/api/diagnose', (req, res) => {
  res.json({
    message: 'Server diagnostics',
    timestamp: new Date().toISOString(),
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT
    },
    api: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
      supportedMethods: ['GET', 'POST', 'OPTIONS']
    },
    endpoints: {
      health: '/api/health',
      trainingData: '/api/training-data',
      geminiPost: '/api/gemini (POST)',
      geminiGet: '/api/gemini (GET)'
    }
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit:', req.body);
  res.json({
    message: 'Test successful',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.get('Origin')
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl} not found`);
  res.status(404).json({
    error: 'Not Found',
    message: `${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/training-data',
      'POST /api/gemini',
      'GET /api/gemini',
      'GET /api/diagnose'
    ]
  });
});

// Start server with enhanced logging
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 CR8 Backend Server Started');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('\n📋 Available endpoints:');
  console.log(`   GET  /                     - Server info`);
  console.log(`   GET  /api/health           - Health check`);
  console.log(`   GET  /api/training-data    - Training data`);
  console.log(`   POST /api/gemini           - AI chat (main)`);
  console.log(`   GET  /api/gemini           - AI chat (test)`);
  console.log(`   GET  /api/diagnose         - Diagnostics`);
  console.log('\n✅ Server ready for connections');
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});