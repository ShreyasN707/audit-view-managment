const express = require('express');
const { getShelf, addToShelf, removeFromShelf } = require('./shelfController');
const protect = require('../../shared/middleware/authMiddleware');
const authorize = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.get('/public/shelf', protect, authorize('public'), getShelf);
router.post('/public/shelf/:auditId', protect, authorize('public'), addToShelf);
router.delete('/public/shelf/:auditId', protect, authorize('public'), removeFromShelf);

module.exports = router;
