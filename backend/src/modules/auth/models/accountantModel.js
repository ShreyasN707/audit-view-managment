const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        default: 'accountant',
        enum: ['accountant']
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    createdAt: {

        type: Date,
        default: Date.now
    }
});

accountantSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

accountantSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Accountant', accountantSchema);
