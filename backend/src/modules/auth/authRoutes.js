const express = require('express');
const { registerPublic, loginPublic, loginAccountant, loginAdmin } = require('./authController');

const router = express.Router();

// Public Routes
router.post('/public/register', registerPublic);
router.post('/public/login', loginPublic);

// Accountant Routes
router.post('/accountant/login', loginAccountant);

// Admin Routes
router.post('/admin/login', loginAdmin);

module.exports = router;
