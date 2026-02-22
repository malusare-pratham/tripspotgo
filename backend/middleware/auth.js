const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');

const protect = async (req, _res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        const error = new Error('Authorization token missing');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id);

        if (!user) {
            const error = new Error('Invalid token user');
            error.statusCode = 401;
            return next(error);
        }

        req.user = user;
        return next();
    } catch (_error) {
        const error = new Error('Invalid or expired token');
        error.statusCode = 401;
        return next(error);
    }
};

module.exports = protect;
