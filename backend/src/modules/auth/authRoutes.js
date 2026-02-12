const express = require('express');
const { registerPublic, loginPublic, loginAccountant, loginAdmin } = require('./authController');
const loginLimiter = require('../../shared/middleware/rateLimiter');

const router = express.Router();

router.post('/public/register', loginLimiter, registerPublic);
router.post('/public/login', loginLimiter, loginPublic);

router.post('/accountant/login', loginLimiter, loginAccountant);

router.post('/admin/login', loginLimiter, loginAdmin);

module.exports = router;
