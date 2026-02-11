const express = require('express');
const { registerPublic, loginPublic, loginAccountant, loginAdmin } = require('./authController');

const router = express.Router();

router.post('/public/register', registerPublic);
router.post('/public/login', loginPublic);

router.post('/accountant/login', loginAccountant);

router.post('/admin/login', loginAdmin);

module.exports = router;
