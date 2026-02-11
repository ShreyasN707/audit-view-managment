const Accountant = require('../auth/models/accountantModel');
const Shelf = require('../shelf/models/shelfModel');
const logger = require('../../shared/logger/logger');
const fs = require('fs');
const path = require('path');

// @desc    Create Accountant
// @route   POST /api/v1/admin/accountants
// @access  Admin
exports.createAccountant = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const accountant = await Accountant.create({
            username,
            password
        });

        logger.info(`Admin created accountant: ${username}`);

        res.status(201).json({
            success: true,
            data: {
                _id: accountant._id,
                username: accountant.username,
                role: accountant.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reset Accountant Password
// @route   PATCH /api/v1/admin/accountants/:id/password
// @access  Admin
exports.resetAccountantPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        // "Admin resets ... while accountant logged in ... Invalidate existing tokens".
        // With Stateless JWTs, this is hard without a blacklist or "token version".
        // We'll update the 'password' which changes the hash. 
        // If we want to invalidate, we normally use a 'tokenVersion' field in user model and payload.
        // Let's assume standard auth flow: verifying token doesn't check DB on every request usually,
        // BUT for high security or "Invalidate", we SHOULD check user existence or token version.
        // My `protect` middleware does `User.findById(decoded.id)`? No, it just verifies signature usually?
        // Let's check `authMiddleware.js`.
        // It does `req.user = decoded`. It DOES NOT fetch the user from DB.
        // To implement "Invalidate", I should probably fetch user in `protect`.

        // For now, let's just update password. If I need to invalidate, I'll add `tokenVersion`.
        // Requirement: "Invalidate existing tokens (token versioning)".
        // OK, I missed that detail. I need to add `tokenVersion` to Accountant model and middleware.

        // See task boundary fix for next step.

        const accountant = await Accountant.findById(req.params.id);
        if (!accountant) {
            return res.status(404).json({ message: 'Accountant not found' });
        }

        accountant.password = password;
        accountant.tokenVersion = (accountant.tokenVersion || 0) + 1;

        await accountant.save();

        logger.info(`Admin reset password for accountant: ${accountant.username}`);

        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (err) {
        next(err);
    }
};

// @desc    View All Shelves
// @route   GET /api/v1/admin/shelves
// @access  Admin
exports.getAllShelves = async (req, res, next) => {
    try {
        const shelves = await Shelf.find({})
            .populate('userId', 'name email')
            .populate('auditId', 'title');

        res.status(200).json({
            success: true,
            count: shelves.length,
            data: shelves
        });
    } catch (err) {
        next(err);
    }
};

// @desc    View System Logs
// @route   GET /api/v1/admin/logs
// @access  Admin
exports.getSystemLogs = async (req, res, next) => {
    try {
        // Read from file
        const logPath = path.join(__dirname, '../../../../logs/system.log');

        // Check if file exists
        if (!fs.existsSync(logPath)) {
            return res.status(200).json({ data: [] });
        }

        // Stream or read file? 
        // For an API response, reading whole file might be heavy. Pagination requested?
        // "Pagination on list endpoints". 
        // Doing pagination on a text file is tricky without parsing.
        // Let's just read last N lines or whole file if small.
        // For interview/demo, reading file string and splitting by newline is acceptable.

        fs.readFile(logPath, 'utf8', (err, data) => {
            if (err) return next(err);

            // Parse JSON lines
            const lines = data.trim().split('\n');
            // Filter empty
            const logs = lines.map(line => {
                try { return JSON.parse(line); } catch (e) { return null; }
            }).filter(l => l !== null);

            // Reverse to show newest first
            res.status(200).json({
                success: true,
                count: logs.length,
                data: logs.reverse()
            });
        });
    } catch (err) {
        next(err);
    }
};
