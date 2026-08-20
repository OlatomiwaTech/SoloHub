const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : (origin, callback) => {
        if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
      },
  credentials: true,
}));

// Webhook routes (commented out for now)
// app.use('/api/webhooks', require('./routes/webhook.routes'));

app.use(express.json());

// ============================================
// ROUTES
// ============================================
// ... other imports and middleware

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/client.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/invoices', require('./routes/invoice.routes')); // ✅ Add this line

// ... rest of the file

// ... rest of the file

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SoloHub API is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// Error handling
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

app.listen(PORT, () => {
  console.log(`🚀 SoloHub backend running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   POST /api/auth/register  - Register new user`);
  console.log(`   POST /api/auth/login     - Login user`);
  console.log(`   GET  /api/auth/me        - Get current user (protected)`);
  console.log(`   GET  /api/clients        - Get all clients (protected)`);
  console.log(`   POST /api/clients        - Create client (protected)`);
  console.log(`   GET  /api/clients/:id    - Get client by ID (protected)`);
  console.log(`   PUT  /api/clients/:id    - Update client (protected)`);
  console.log(`   DELETE /api/clients/:id  - Delete client (protected)`);
  console.log(`   GET  /api/health         - Health check`);
});