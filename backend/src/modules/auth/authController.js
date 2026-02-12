const User = require('./models/userModel');
const Accountant = require('./models/accountantModel');
const jwt = require('jsonwebtoken');
const logger = require('../../shared/logger/logger');

const generateTokens = (id, role) => {
    // Access Token (Short: 15m)
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Refresh Token (Long: 7d)
    const refreshToken = jwt.sign({ id, role, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

exports.registerPublic = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role: 'public'
        });

        const { accessToken, refreshToken } = generateTokens(user._id, 'public');

        // Store refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        logger.info(`New public user registered: ${email}`);

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
};

exports.loginPublic = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            logger.warn(`Failed login attempt for public user: ${email}`);
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, 'public');

        // Store refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        logger.info(`Public user logged in: ${email}`);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
};

exports.loginAccountant = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const accountant = await Accountant.findOne({ username }).select('+password');

        if (!accountant || !(await accountant.matchPassword(password))) {
            logger.warn(`Failed login attempt for accountant: ${username}`);
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        const token = jwt.sign(
            { id: accountant._id, role: 'accountant', version: accountant.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        logger.info(`Accountant logged in: ${username}`);

        res.status(200).json({
            success: true,
            token
        });

    } catch (err) {
        next(err);
    }
};

exports.loginAdmin = async (req, res, next) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const { accessToken } = generateTokens('admin-id', 'admin');
        logger.info(`Admin logged in`);
        return res.status(200).json({
            success: true,
            token: accessToken // Admin still uses single token for now as per existing frontend
        });
    }

    logger.warn(`Failed admin login attempt`);
    res.status(401).json({ message: 'Invalid admin credentials' });
};

exports.refreshTokenPublic = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Please provide a refresh token' });
    }

    try {
        // 1. Verify Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // 2. Find User and Check Stored Token
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid Refresh Token' });
        }

        // 3. Generate New Tokens (Rotate Refresh Token)
        const newTokens = generateTokens(user._id, 'public');

        user.refreshToken = newTokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken
        });

    } catch (err) {
        return res.status(401).json({ message: 'Invalid/Expired Refresh Token' });
    }
};
