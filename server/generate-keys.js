const crypto = require('crypto');

// Generate a JWT secret key
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT_SECRET:', jwtSecret);

// Generate an encryption key (32 bytes)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY:', encryptionKey);