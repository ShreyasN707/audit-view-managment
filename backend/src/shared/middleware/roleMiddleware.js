const logger = require('../logger/logger');

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.warn(`Access denied directly for user ${req.user.id} with role ${req.user.role}`);
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = authorize;
