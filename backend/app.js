const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./src/shared/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

const authRoutes = require('./src/modules/auth/authRoutes');
const auditRoutes = require('./src/modules/audits/auditRoutes');
const shelfRoutes = require('./src/modules/shelf/shelfRoutes');
const adminRoutes = require('./src/modules/admin/adminRoutes');

app.use('/api/v1', authRoutes);
app.use('/api/v1', auditRoutes);
app.use('/api/v1', shelfRoutes);
app.use('/api/v1', adminRoutes);

app.get('/', (req, res) => {
    res.send('Audit System API is running...');
});

app.use(errorHandler);

module.exports = app;
