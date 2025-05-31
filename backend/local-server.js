import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Handle OPTIONS requests for CORS preflight
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`;

app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running', status: 'OK' });
});

app.get('/backend/api/health', (req, res) => {
  res.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

app.post('/backend/api/gemini', async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY not found in environment variables'
    });
  }

  // Validate prompt
  if (!prompt) {
    return res.status(400).json({
      error: 'Prompt is required'
    });
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/backend/api/health`);
  console.log(`API Key present: ${!!process.env.GEMINI_API_KEY}`);
});