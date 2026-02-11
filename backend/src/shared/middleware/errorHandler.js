const logger = require('../logger/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Log full stack to file system

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Specific handling for known errors if needed
    if (err.name === 'ValidationError') {
        return res.status(400).json({ status: 'fail', message: err.message });
    }

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Internal Server Error' : message
    });
};

module.exports = errorHandler;
