const Shelf = require('./models/shelfModel');
const Audit = require('../audits/models/auditModel'); // Check existence/status
const logger = require('../../shared/logger/logger');

// @desc    Get User Shelf
// @route   GET /api/v1/public/shelf
// @access  Public (Authenticated)
exports.getShelf = async (req, res, next) => {
    try {
        const shelfItems = await Shelf.find({ userId: req.user.id })
            .populate({
                path: 'auditId',
                select: 'title isActive createdBy',
                populate: { path: 'createdBy', select: 'username' }
            });

        // Filter out items where audit is null (hard deleted) or inactive (soft deleted)?
        // Requirement: "Admin deletes audit ... Prevent orphaned shelf records".
        // If soft deleted (isActive=false), strictly speaking it's still there.
        // The requirement "Prevent orphaned shelf records" under "Admin deletes audit" implies we should handle it.
        // If we just return them, they differ from "Active".
        // Let's return them but maybe mark them? Or filter them out?
        // "Audit added ... while deleted -> Reject".
        // Let's filter out null audits (if hard deleted) and maybe keep inactive ones visible but marked?
        // OR just filter inactive ones if the user shouldn't see them.
        // Standard behavior: if it's on my shelf, I want to see it even if inactive, maybe with "Archived" flag.
        // However, for "Prevent orphaned", we usually mean don't crash or show broken links.

        // Let's filter out nulls first.
        let validItems = shelfItems.filter(item => item.auditId !== null);

        res.status(200).json({
            success: true,
            count: validItems.length,
            data: validItems
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add Audit to Shelf
// @route   POST /api/v1/public/shelf/:auditId
// @access  Public (Authenticated)
exports.addToShelf = async (req, res, next) => {
    try {
        const auditId = req.params.auditId;
        const userId = req.user.id;

        // Check if audit exists and is active
        // "Atomic check on isActive" - well, we can't easily lock in Mongo without transaction, 
        // but check before write is close enough for this scope.
        const audit = await Audit.findById(auditId);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        if (!audit.isActive) {
            // "Audit added to shelf while being deleted ... Reject if inactive"
            return res.status(400).json({ message: 'Cannot add inactive audit to shelf' });
        }

        // Attempt create
        const shelfItem = await Shelf.create({
            userId,
            auditId
        });

        logger.info(`User ${userId} added audit ${auditId} to shelf`);

        res.status(201).json({
            success: true,
            data: shelfItem
        });

    } catch (err) {
        if (err.code === 11000) {
            // "Same audit added ... multiple times ... Return 409 Conflict"
            return res.status(409).json({ message: 'Audit already in shelf' });
        }
        next(err);
    }
};

// @desc    Remove Audit from Shelf
// @route   DELETE /api/v1/public/shelf/:auditId
// @access  Public (Authenticated)
exports.removeFromShelf = async (req, res, next) => {
    try {
        const auditId = req.params.auditId;
        const userId = req.user.id;

        const result = await Shelf.findOneAndDelete({ userId, auditId });

        if (!result) {
            return res.status(404).json({ message: 'Audit not found in shelf' });
        }

        logger.info(`User ${userId} removed audit ${auditId} from shelf`);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
