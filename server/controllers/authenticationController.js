const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    name,
    dateOfBirth,
    profilePicture,
    bio,
    interests = []
  } = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  // Check for existing user
  const userExists = await User.findOne({ email }).lean().exec();
  if (userExists) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  // Create user
  const userObject = {
    email,
    password,
    name,
    dateOfBirth: dateOfBirth || null,
    profilePicture: profilePicture || '',
    bio: bio || '',
    interests,
    role: 'user',
    connections: { firstDegree: [] },
    connectionMetrics: {
      totalFirstDegree: 0,
      totalSecondDegree: 0,
      totalThirdDegree: 0,
      totalFourthDegree: 0,
      totalFifthDegree: 0
    },
    connectionStrengths: [],
    privacySettings: {
      showProfile: 'public',
      showConnections: 'connections'
    }
  };

  try {
    const user = await User.create(userObject);
    
    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);
    
    // Return success with user info and token
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.status(201).json({
      message: 'Registration successful',
      user: userToReturn,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Update last active
  user.lastActive = new Date();
  await user.save();
  
  // Generate token
  const token = generateToken(user._id, user.email, user.role);
  
  // Return success with user info and token
  const userToReturn = { ...user.toObject() };
  delete userToReturn.password;
  
  res.json({
    message: 'Login successful',
    user: userToReturn,
    token
  });
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  // Get user data from database (excluding password)
  const user = await User.findById(req.user.userId).select('-password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
});

// Helper function to generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};