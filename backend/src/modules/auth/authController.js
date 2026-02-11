const User = require('./models/userModel');
const Accountant = require('./models/accountantModel');
const jwt = require('jsonwebtoken');
const logger = require('../../shared/logger/logger');

// Generate JWT
const generateToken = (id, role) => {
    let expiresIn = '30m'; // Default Public
    if (role === 'accountant') expiresIn = '10m'; // Accountant 10 min (strict)
    if (role === 'admin') expiresIn = '5m';      // Admin 5 min (strict)

    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn
    });
};

// @desc    Register user (Public)
// @route   POST /api/v1/public/register
// @access  Public
exports.registerPublic = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role: 'public'
        });

        const token = generateToken(user._id, 'public');

        logger.info(`New public user registered: ${email}`);

        res.status(201).json({
            success: true,
            token
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user (Public)
// @route   POST /api/v1/public/login
// @access  Public
exports.loginPublic = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            logger.warn(`Failed login attempt for public user: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, 'public');

        logger.info(`Public user logged in: ${email}`);

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login Accountant
// @route   POST /api/v1/accountant/login
// @access  Public (Credentials provided by Admin)
exports.loginAccountant = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const accountant = await Accountant.findOne({ username }).select('+password');

        if (!accountant || !(await accountant.matchPassword(password))) {
            logger.warn(`Failed login attempt for accountant: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: accountant._id, role: 'accountant', version: accountant.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '10m' });

        logger.info(`Accountant logged in: ${username}`);

        res.status(200).json({
            success: true,
            token
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Login Admin
// @route   POST /api/v1/admin/login
// @access  Public (Hardcoded credentials)
exports.loginAdmin = async (req, res, next) => {
    const { username, password } = req.body;

    console.log('Login Attempt:', { username, password });
    console.log('Expected:', { user: process.env.ADMIN_USERNAME, pass: process.env.ADMIN_PASSWORD });

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken('admin-id', 'admin');
        logger.info(`Admin logged in`);
        return res.status(200).json({
            success: true,
            token
        });
    }

    logger.warn(`Failed admin login attempt`);
    res.status(401).json({ message: 'Invalid admin credentials' });
};

