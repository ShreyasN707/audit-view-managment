const Audit = require('./models/auditModel');
const logger = require('../../shared/logger/logger');

exports.getAudits = async (req, res, next) => {
    try {
        const query = { isActive: true };

        // Admin might want to see all audits, including inactive ones
        if (req.user && req.user.role === 'admin') {
            delete query.isActive;
        }

        const audits = await Audit.find(query).populate('createdBy', 'username');

        res.status(200).json({
            success: true,
            count: audits.length,
            data: audits
        });
    } catch (err) {
        next(err);
    }
};

exports.createAudit = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const audit = await Audit.create(req.body);

        logger.info(`Audit created by accountant ${req.user.id}: ${audit.title}`);

        res.status(201).json({
            success: true,
            data: audit
        });
    } catch (err) {
        next(err);
    }
};

exports.updateAudit = async (req, res, next) => {
    try {
        let audit = await Audit.findById(req.params.id);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        if (audit.createdBy.toString() !== req.user.id) {
            logger.warn(`Accountant ${req.user.id} tried to update audit ${audit._id} owned by ${audit.createdBy}`);
            return res.status(403).json({ message: 'Not authorized to update this audit' });
        }

        audit = await Audit.findByIdAndUpdate(req.params.id, { title: req.body.title }, {
            new: true,
            runValidators: true
        });

        logger.info(`Audit updated by accountant ${req.user.id}: ${audit._id}`);

        res.status(200).json({
            success: true,
            data: audit
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteAudit = async (req, res, next) => {
    try {
        const audit = await Audit.findById(req.params.id);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        audit.isActive = false;
        await audit.save();

        logger.info(`Audit soft-deleted by admin: ${audit._id}`);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

exports.getAdminAudits = async (req, res, next) => {
    try {
        const audits = await Audit.find({}).populate('createdBy', 'username');
        res.status(200).json({
            success: true,
            count: audits.length,
            data: audits
        });
    } catch (err) {
        next(err);
    }
};
