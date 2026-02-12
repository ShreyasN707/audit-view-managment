const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (req.user.role === 'accountant') {
            const Accountant = require('../../modules/auth/models/accountantModel');
            const accountant = await Accountant.findById(req.user.id);

            if (!accountant || accountant.tokenVersion !== req.user.version) {
                logger.warn(`Auth failed: Token version mismatch for accountant ${req.user.id}`);
                return res.status(401).json({ message: 'Not authorized, token invalid' });
            }
        }

        next();
    } catch (error) {
        logger.error(`Auth failed: ${error.message}`);
        next(error);
    }
};

module.exports = protect;
