const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Accountant',
        required: true,
        index: true // Index for performance
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedOn on save
auditSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Audit', auditSchema);
