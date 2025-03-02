const express = require('express')
const router = express.Router()
const authenticationController = require('../controllers/authenticationController')
const authMiddleware = require('../utils/middleware/authMiddleware');

router.route('/register')
    .post(authenticationController.registerUser)

router.route('/login')
    .post(authenticationController.loginUser)

// Protected routes
router.route('/me')
    .get(authMiddleware.authenticateToken, authenticationController.getCurrentUser);

router.route('/delete')
    .delete()

router.route('/changePassword')
    .post()

router.route('/forgotPassword')
    .post()
router.route('/resetPassword')
    .post()

module.exports = router