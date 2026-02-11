const express = require('express');
const { getAudits, createAudit, updateAudit, deleteAudit, getAdminAudits } = require('./auditController');
const protect = require('../../shared/middleware/authMiddleware');
const authorize = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

// Public Routes (Audits list)
// "Can view all audits" - Requirement lists under Public User.
// Assuming they need to be logged in? "Can login ... Can view all audits". 
// Let's protect it for 'public' role.
router.get('/public/audits', protect, authorize('public'), getAudits);

// Accountant Routes
router.get('/accountant/audits', protect, authorize('accountant'), getAudits);
router.post('/accountant/audits', protect, authorize('accountant'), createAudit);
router.patch('/accountant/audits/:id', protect, authorize('accountant'), updateAudit);

// Admin Routes
router.get('/admin/audits', protect, authorize('admin'), getAdminAudits);
router.delete('/admin/audits/:id', protect, authorize('admin'), deleteAudit);

module.exports = router;
