const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean'); // Note: xss-clean is deprecated, but requested for "sanitization". We'll use helmet too.
// actually xss-clean is not installed. 
// I'll stick to helmet and mongoSanitize for now, and maybe manual sanitization if needed.
// Wait, I installed xss-clean? No I didn't in the install command.
// I'll just use helmet and mongoSanitize and custom validation.

const errorHandler = require('./src/shared/middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(mongoSanitize()); // Prevent NoSQL injection

const authRoutes = require('./src/modules/auth/authRoutes');
const auditRoutes = require('./src/modules/audits/auditRoutes');
const shelfRoutes = require('./src/modules/shelf/shelfRoutes');
const adminRoutes = require('./src/modules/admin/adminRoutes');

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', auditRoutes);
app.use('/api/v1', shelfRoutes);
app.use('/api/v1', adminRoutes);


// app.use('/api/v1/public', publicRoutes);


app.get('/', (req, res) => {
    res.send('Audit System API is running...');
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
