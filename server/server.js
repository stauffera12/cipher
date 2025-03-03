require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const helmet = require('helmet'); // Security middleware
const rateLimit = require('express-rate-limit'); // Rate limiting
const connectDB = require("./config/dbConn");

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Connection check middleware
const checkConnection = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.DATABASE_URI);
        } catch (err) {
            return res.status(500).json({ message: 'Database connection not available' });
        }
    }
    next();
};

// Middleware setup
app.use(bodyParser.json({ type: 'application/json; charset=utf-8' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // In production, set to your specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(checkConnection);

// Route definitions
const routes = {
  '/users': './routes/userRoutes',
  '/posts': './routes/postRoutes',
  '/auth': './routes/authenticationRoutes',
  '/stripe': './routes/stripeRoutes',
  '/invite': './routes/inviteRout'
};

// Register routes
Object.entries(routes).forEach(([path, routePath]) => {
  try {
    const router = require(routePath);
    app.use(path, router);
  } catch (err) {
    console.error(`Failed to load route ${routePath}:`, err);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Initiating graceful shutdown...');
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server function
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Initialize server
let server;
startServer().then(s => {
  server = s;
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});