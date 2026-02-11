const Audit = require('./models/auditModel');
const logger = require('../../shared/logger/logger');

// @desc    Get all audits (Public/Accountant/Admin)
// @route   GET /api/v1/public/audits
// @route   GET /api/v1/accountant/audits
// @route   GET /api/v1/admin/audits
// @access  Public/Private
exports.getAudits = async (req, res, next) => {
    try {
        const query = { isActive: true };

        // Admin can see all, others only active? Requirement says "View all audits" for everyone.
        // "Admin: View all audits", "Accountant: View all audits", "Public: Can view all audits".
        // "Admin deletes audits" -> "Use soft delete (isActive=false)".
        // So usually "View all audits" implies active ones for Public/Accountant.
        // Admin might want to see inactive ones too? 
        // Requirement says: "Admin ... View all audits". 
        // Let's assume Public/Accountant see ACTIVE only. Admin see ALL?
        // "Admin can ... Delete audits".

        // If user is admin (checked via req.user usually, but public doesn't have req.user if endpoint is open)
        // Actually Public endpoint /api/v1/public/audits is likely open or authenticated?
        // "Public User ... Can login ... Can view all audits".
        // So likely authenticated.

        if (req.user && req.user.role === 'admin') {
            // Admin sees everything
            // Or maybe filter? Let's just return active for now unless specific param?
            // Requirement: "Admin deletes audit that exists in shelves ... Use soft delete".
            // Let's default to Active for everyone, maybe Admin has specific endpoint to see deleted?
            // Or just standard list.
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

// @desc    Create Audit
// @route   POST /api/v1/accountant/audits
// @access  Accountant
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

// @desc    Update Audit
// @route   PATCH /api/v1/accountant/audits/:id
// @access  Accountant (Own only)
exports.updateAudit = async (req, res, next) => {
    try {
        let audit = await Audit.findById(req.params.id);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        // Ownership check
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

// @desc    Delete Audit (Soft)
// @route   DELETE /api/v1/admin/audits/:id
// @access  Admin
exports.deleteAudit = async (req, res, next) => {
    try {
        const audit = await Audit.findById(req.params.id);

        if (!audit) {
            return res.status(404).json({ message: 'Audit not found' });
        }

        // Soft delete
        audit.isActive = false;
        await audit.save();

        // Note: "Prevent orphaned shelf records" - "Same audit added ... Admin deletes ...".
        // "Admin deletes audit that exists in shelves -> Use soft delete (isActive=false) -> Prevent orphaned shelf records".
        // This implies Shelf should probably check isActive when retrieving, OR we don't physically delete Shelf records,
        // just filter them out or show them as "Audit Deleted".
        // Requirement says "Prevent orphaned shelf records".
        // If we soft delete the audit, the shelf record still points to a valid Audit ID.
        // So technically not orphaned in DB strict sense, but logically orphaned.
        // We'll handle this in the Shelf retrieval logic (populate and filter null/inactive).

        logger.info(`Audit soft-deleted by admin: ${audit._id}`);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Audits (Admin View)
// @route   GET /api/v1/admin/audits
// @access  Admin
exports.getAdminAudits = async (req, res, next) => {
    try {
        // Admin sees all, including inactive?
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
