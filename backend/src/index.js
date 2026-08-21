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

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Your routes go here...
app.use('/api/auth', require('./routes/auth.routes'));
// ... other routes