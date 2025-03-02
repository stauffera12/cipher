const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  // Basic fields
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Encrypted fields example (for sensitive information)
  dateOfBirth: { 
    type: String,
    set: function(value) {
      if (!value) return null;
      return encrypt(value.toString());
    },
    get: function(value) {
      if (!value) return null;
      return decrypt(value);
    }
  },
  
  // Normal fields
  profilePicture: { 
    type: String 
  },
  bio: { 
    type: String 
  },
  interests: [{ 
    type: String 
  }],
  connections: {
    firstDegree: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }]
  },
  connectionMetrics: {
    totalFirstDegree: { type: Number, default: 0 },
    totalSecondDegree: { type: Number, default: 0 },
    totalThirdDegree: { type: Number, default: 0 },
    totalFourthDegree: { type: Number, default: 0 },
    totalFifthDegree: { type: Number, default: 0 }
  },
  connectionStrengths: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    strength: { type: Number, default: 0 }
  }],
  lastActive: { type: Date, default: Date.now },
  joinDate: { type: Date, default: Date.now },
  privacySettings: {
    showProfile: { 
      type: String, 
      enum: ['public', 'connections', 'private'], 
      default: 'public' 
    },
    showConnections: { 
      type: String, 
      enum: ['public', 'connections', 'private'], 
      default: 'connections' 
    }
  },
  // Token for password reset (optional)
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  toJSON: { getters: true }, // Apply getters when converting to JSON
  toObject: { getters: true } // Apply getters when converting to object
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);