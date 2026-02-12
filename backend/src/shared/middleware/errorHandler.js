const logger = require('../logger/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    // Mongoose duplicate key
    if (err.code === 11000) {
        // Handle cases where keyValue might be undefined or empty
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
        const message = `Duplicate field value entered: ${field}. Please use another value`;
        return res.status(400).json({ status: 'fail', message: message });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        return res.status(400).json({ status: 'fail', message: err.message });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        return res.status(404).json({ status: 'fail', message: message });
    }

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Internal Server Error' : message
    });
};

module.exports = errorHandler;

