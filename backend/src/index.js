const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:5173',
  credentials: true,
}));

// ============================================
// ⚠️ Webhook routes must come BEFORE express.json()
// TODO: Uncomment when we implement Paystack webhooks
// ============================================
// app.use('/api/webhooks', require('./routes/webhook.routes'));

// Regular JSON middleware for all other routes
app.use(express.json());

// ============================================
// AUTH ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth.routes'));

// ============================================
// OTHER ROUTES (will add later)
// ============================================
// app.use('/api/clients', require('./routes/client.routes'));
// app.use('/api/projects', require('./routes/project.routes'));
// app.use('/api/invoices', require('./routes/invoice.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SoloHub API is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SoloHub backend running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   POST /api/auth/register - Register new user`);
  console.log(`   POST /api/auth/login    - Login user`);
  console.log(`   GET  /api/auth/me       - Get current user (protected)`);
  console.log(`   GET  /api/health        - Health check`);
});