const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const platformRoutes = require('./routes/platforms');
const wordpressRoutes = require('./routes/wordpress');
const analyticsRoutes = require('./routes/analytics');
const scheduleRoutes = require('./routes/schedule');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/wordpress', wordpressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Social Auto Publisher API is running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Social Auto Publisher API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
