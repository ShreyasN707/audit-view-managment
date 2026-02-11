const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


const errorHandler = require('./src/shared/middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());

// Logging Middleware (Debug)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(cors({ origin: '*', credentials: true })); // Allow all for dev
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
