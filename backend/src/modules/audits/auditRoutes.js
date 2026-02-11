const express = require('express');
const { getAudits, createAudit, updateAudit, deleteAudit, getAdminAudits } = require('./auditController');
const protect = require('../../shared/middleware/authMiddleware');
const authorize = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.get('/public/audits', protect, authorize('public'), getAudits);

router.get('/accountant/audits', protect, authorize('accountant'), getAudits);
router.post('/accountant/audits', protect, authorize('accountant'), createAudit);
router.patch('/accountant/audits/:id', protect, authorize('accountant'), updateAudit);

router.get('/admin/audits', protect, authorize('admin'), getAdminAudits);
router.delete('/admin/audits/:id', protect, authorize('admin'), deleteAudit);

module.exports = router;
