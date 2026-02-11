const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    auditId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Audit',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

shelfSchema.index({ userId: 1, auditId: 1 }, { unique: true });

module.exports = mongoose.model('Shelf', shelfSchema);
