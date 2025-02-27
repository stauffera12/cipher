const express = require('express')
const router = express.Router()
const authenticationController = require('../controllers/authenticationController')
const User = require('../models/User')

router.route('/signup')
    .post()

router.route('/login')
    .post()

router.route('/delete')
    .delete()

router.route('/changePassword')
    .post()

router.route('/forgotPassword')
    .post()
router.route('/resetPassword')
    .post()

module.exports = router