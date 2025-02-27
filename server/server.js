require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose'); // Add this import
const connectDB = require("./config/dbConn");

const app = express();
const PORT = process.env.PORT || 8000;

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
app.use(cors({ origin: "*" }));
app.use(express.json());

// UTF-8 Header Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});


app.use(checkConnection);

// Route definitions
const routes = {
  '/users': './routes/userRoutes',
  '/posts': './routes/postRoutes',
  '/auth': './routes/authenticationRoutes',
  '/stripe': './routes/stripeRoutes',
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

//imageRoutes(app);

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