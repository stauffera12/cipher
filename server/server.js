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
  '/auth': './routes/authenticationRoutes', // New authentication routes
  '/stripe': './routes/stripeRoutes',
};

app.get('/invite', (req, res) => {
  const { code } = req.query;
  const userAgent = req.get('User-Agent');
  
  // Function to handle error redirects consistently
  const handleErrorRedirect = (reason = 'unknown') => {
    const errorDeepLink = `yourapp://invite/error?reason=${reason}`;
    
    // For Android users
    if (/android/i.test(userAgent)) {
      return res.redirect(`https://play.google.com/store/apps/details?id=com.yourapp.android&referrer=${encodeURIComponent(errorDeepLink)}`);
    } 
    // For iOS users
    else if (/iPad|iPhone|iPod/.test(userAgent)) {
      return res.redirect(`https://apps.apple.com/app/yourapp?id=yourapp-id&referrer=${encodeURIComponent(errorDeepLink)}`);
    }
    
    // Default fallback for unsupported platforms - always use the error page
    return res.redirect('https://yourwebsite.com/invite-error');
  };

  // Check if code is missing
  if (!code) {
    return handleErrorRedirect('missing_code');
  }
  
  // Validate the invite code (replace this with your actual validation logic)
  const isValidCode = validateInviteCode(code);
  if (!isValidCode) {
    return handleErrorRedirect('invalid_code');
  }

  // Check if code is expired (replace with your actual expiration check)
  const isExpired = checkIfCodeExpired(code);
  if (isExpired) {
    return handleErrorRedirect('expired_code');
  }

  // Any other validation failures would go here
  // if (otherValidationFailed) {
  //   return handleErrorRedirect('other_reason');
  // }

  // Only if ALL validations pass, proceed with the normal flow
  const deepLink = `yourapp://invite?code=${code}`;

  // For Android users
  if (/android/i.test(userAgent)) {
    return res.redirect(`https://play.google.com/store/apps/details?id=com.yourapp.android&referrer=${encodeURIComponent(deepLink)}`);
  } 
  // For iOS users
  else if (/iPad|iPhone|iPod/.test(userAgent)) {
    return res.redirect(`https://apps.apple.com/app/yourapp?id=yourapp-id&referrer=${encodeURIComponent(deepLink)}`);
  }

  // Default redirect for unsupported platforms
  // Even this is an error case, so redirect to error page
  return handleErrorRedirect('unsupported_platform');
});

// Example validation functions (replace these with your actual implementations)
function validateInviteCode(code) {
  // Your code to validate the invite code
  // For example: check if it exists in your database
  return true; // Return true if valid, false otherwise
}

function checkIfCodeExpired(code) {
  // Your code to check if the invite code is expired
  return false; // Return true if expired, false otherwise
}

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