const express = require('express');
const { createAccountant, resetAccountantPassword, getAllShelves, getSystemLogs } = require('./adminController');
const protect = require('../../shared/middleware/authMiddleware');
const authorize = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/admin/accountants', createAccountant);
router.patch('/admin/accountants/:id/password', resetAccountantPassword);
router.get('/admin/shelves', getAllShelves);
router.get('/admin/logs', getSystemLogs);

module.exports = router;
