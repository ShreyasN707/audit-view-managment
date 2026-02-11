const Accountant = require('../auth/models/accountantModel');
const Shelf = require('../shelf/models/shelfModel');
const logger = require('../../shared/logger/logger');
const fs = require('fs');
const path = require('path');

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

exports.resetAccountantPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
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

exports.getSystemLogs = async (req, res, next) => {
    try {
        const logPath = path.join(__dirname, '../../../logs/system.log');

        if (!fs.existsSync(logPath)) {
            return res.status(200).json({ data: [] });
        }

        fs.readFile(logPath, 'utf8', (err, data) => {
            if (err) return next(err);

            res.status(200).json({
                success: true,
                data: data
            });
        });
    } catch (err) {
        next(err);
    }
};
