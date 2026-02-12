const express = require('express');
const { createAccountant, resetAccountantPassword, getAllShelves, getSystemLogs } = require('./adminController');
const protect = require('../../shared/middleware/authMiddleware');
const authorize = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.post('/admin/accountants', protect, authorize('admin'), createAccountant);
router.patch('/admin/accountants/:id/password', protect, authorize('admin'), resetAccountantPassword);
router.get('/admin/shelves', protect, authorize('admin'), getAllShelves);
router.get('/admin/logs', protect, authorize('admin'), getSystemLogs);

module.exports = router;
