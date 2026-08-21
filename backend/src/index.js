const express = require('express');
const cors = require('cors');
// ... other imports

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'https://solo-hub-two.vercel.app',    // Your Vercel frontend
  'https://solohub-waqs.onrender.com',  // Your Render backend
  'http://localhost:5173',              // Local development
  'http://localhost:5000',              // Local backend
];

const allowedOrigins = [
  'https://solo-hub-two.vercel.app',
  'https://solohub-waqs.onrender.com',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Your routes go here...
app.use('/api/auth', require('./routes/auth.routes'));
// ... other routes