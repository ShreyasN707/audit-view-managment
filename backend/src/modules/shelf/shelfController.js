const Shelf = require('./models/shelfModel');
const Audit = require('../audits/models/auditModel');
const logger = require('../../shared/logger/logger');

exports.getShelf = async (req, res, next) => {
    try {
        const shelfItems = await Shelf.find({ userId: req.user.id })
            .populate({
                path: 'auditId',
                select: 'title isActive createdBy',
                populate: { path: 'createdBy', select: 'username' }
            });

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

exports.addToShelf = async (req, res, next) => {
    try {
        const auditId = req.params.auditId;
        const userId = req.user.id;

        const audit = await Audit.findById(auditId);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        if (!audit.isActive) {
            return res.status(400).json({ message: 'Cannot add inactive audit to shelf' });
        }

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
            return res.status(409).json({ message: 'Audit already in shelf' });
        }
        next(err);
    }
};

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
