const winston = require('winston');
const path = require('path');

// Logs directory
const logDir = path.join(__dirname, '../../../../logs'); // Adjust path to root logs if needed, or just backend/logs
// The user asked for "logs/system.log" in the root or adaptable.
// Let's put it in backend/logs for now or root logs?
// The prompt said:
// src/ ...
// logs/system.log
// So it seems logs is at the same level as src? No, the structure showed:
// src/
// logs/
// ...
// So it's root/backend/logs probably.

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../../../logs/system.log'), level: 'info' }),
        new winston.transports.Console() // For docker logs
    ],
});

module.exports = logger;
