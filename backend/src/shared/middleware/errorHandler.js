const logger = require('../logger/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    if (err.code === 11000) {
        // Handle cases where keyValue might be undefined or empty
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
        const value = err.keyValue ? err.keyValue[field] : '';
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use another one.`;
        return res.status(409).json({ status: 'fail', message: message });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({ status: 'fail', message: message });
    }

    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        return res.status(404).json({ status: 'fail', message: message });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ status: 'fail', message: 'Your token has expired. Please log in again.' });
    }

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Internal Server Error' : message
    });
};

module.exports = errorHandler;

