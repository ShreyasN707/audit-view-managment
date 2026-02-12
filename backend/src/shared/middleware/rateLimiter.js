const rateLimit = require('express-rate-limit');
const logger = require('../logger/logger');

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 8,
    message: {
        message: 'Too many login attempts from this IP, please try again after 5 minutes'
    },
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = loginLimiter;
