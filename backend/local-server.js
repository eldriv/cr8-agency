import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Simplified CORS configuration for production
const corsOptions = {
  origin: [
    'https://cr8-agency-production.up.railway.app/',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log('Origin:', req.get('Origin'));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.method === 'POST' && req.body) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Training data
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

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CR8 Backend Server - Railway Production',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/training-data',
      'POST /api/gemini',
      'GET /api/diagnose'
    ]
  });
});

// Health check with supported methods
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    supportedMethods: {
      '/api/gemini': ['POST', 'OPTIONS'],
      '/api/health': ['GET', 'OPTIONS'],
      '/api/training-data': ['GET', 'OPTIONS'],
      '/api/diagnose': ['GET', 'OPTIONS']
    }
  });
});

// Training data endpoint
app.get('/api/training-data', (req, res) => {
  console.log('Serving training data, length:', TRAINING_DATA.length);
  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
  res.status(200).send(TRAINING_DATA);
});

// Gemini API helper function
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
      maxOutputTokens: 2048
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  console.log('Making request to Gemini API...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error.name === 'AbortError' ? new Error('Gemini API request timeout') : error;
  }
};

// Main POST endpoint for /api/gemini
app.post('/api/gemini', async (req, res) => {
  console.log('POST /api/gemini - Request received:', {
    headers: req.headers,
    body: req.body
  });

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }
    if (prompt.length > 10000) {
      return res.status(400).json({ error: 'Prompt too long (max 10000 characters)' });
    }

    const data = await callGeminiAPI(prompt);
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return res.status(500).json({ error: 'No valid response from AI service' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in POST /api/gemini:', error.message);
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    if (error.message.includes('timeout')) {
      statusCode = 504;
      errorMessage = 'Gateway Timeout';
    } else if (error.message.includes('GEMINI_API_KEY')) {
      statusCode = 503;
      errorMessage = 'Service Configuration Error';
    }
    res.status(statusCode).json({
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Diagnostics endpoint
app.get('/api/diagnose', (req, res) => {
  res.json({
    message: 'Server diagnostics',
    timestamp: new Date().toISOString(),
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
      port: PORT
    },
    api: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      supportedMethods: {
        '/api/gemini': ['POST', 'OPTIONS'],
        '/api/health': ['GET', 'OPTIONS'],
        '/api/training-data': ['GET', 'OPTIONS'],
        '/api/diagnose': ['GET', 'OPTIONS']
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/training-data',
      'POST /api/gemini',
      'GET /api/diagnose'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`CR8 Backend Server Started on Railway, port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));