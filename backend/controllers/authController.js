const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

const normalizeIdentifier = (email, mobile) => {
    if (email) {
        return { email: String(email).trim().toLowerCase() };
    }
    if (mobile) {
        const normalizedMobile = String(mobile).trim();
        return { mobileNumber: normalizedMobile };
    }
    return null;
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, mobile, password, membershipPlan } = req.body;

    if (!name || !mobile || !password || !membershipPlan) {
        const error = new Error('name, mobile, password and membershipPlan are required');
        error.statusCode = 400;
        throw error;
    }

    const allowedPlans = ['Single Plan', 'Family Plan'];
    if (!allowedPlans.includes(String(membershipPlan).trim())) {
        const error = new Error('membershipPlan must be Single Plan or Family Plan');
        error.statusCode = 400;
        throw error;
    }

    const userPayload = {
        name: String(name).trim(),
        password: String(password),
        mobileNumber: String(mobile).trim(),
        membershipPlan: String(membershipPlan).trim(),
        ...(email ? { email: String(email).trim().toLowerCase() } : {})
    };

    const query = [
        { mobileNumber: userPayload.mobileNumber },
        { mobile: userPayload.mobileNumber }
    ];
    if (userPayload.email) query.push({ email: userPayload.email });

    if (query.length > 0) {
        const existingUser = await User.findOne({ $or: query });
        if (existingUser) {
            const error = new Error('User already exists with the given email/mobile');
            error.statusCode = 409;
            throw error;
        }
    }

    const user = await User.create(userPayload);
    const token = generateToken(user._id.toString());

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: user.toSafeObject()
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    if (!password || !mobile) {
        const error = new Error('mobile and password are required');
        error.statusCode = 400;
        throw error;
    }

    const normalizedMobile = String(mobile).trim();
    const identifierQuery = normalizeIdentifier(null, normalizedMobile);
    let user = await User.findOne(identifierQuery).select('+password');

    // Backward compatibility: legacy records might have `mobile` only.
    if (!user) {
        user = await User.findOne({ mobile: normalizedMobile }).select('+password');
    }

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isValidPassword = await user.matchPassword(String(password));
    if (!isValidPassword) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    // Start 48hr timer only once; re-login must not reset it.
    let shouldSave = false;
    if (!user.membershipExpiresAt) {
        const startTime = user.membershipActivatedAt ? new Date(user.membershipActivatedAt) : new Date();
        const expiresAt = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);

        user.membershipActivatedAt = startTime;
        user.membershipExpiresAt = expiresAt;
        shouldSave = true;
    }

    user.lastLoginAt = new Date();
    shouldSave = true;

    if (shouldSave) {
        await user.save();
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: user.toSafeObject()
    });
});

const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user.toSafeObject()
    });
});

module.exports = {
    registerUser,
    loginUser,
    getProfile
};
