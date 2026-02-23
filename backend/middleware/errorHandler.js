const errorHandler = (error, _req, res, _next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose schema validation errors
    if (error.name === 'ValidationError') {
        statusCode = 400;
        const firstIssue = Object.values(error.errors || {})[0];
        if (firstIssue?.message) {
            message = firstIssue.message;
        }
    }

    // Mongo duplicate key (unique index) errors
    if (error.code === 11000) {
        statusCode = 409;
        const duplicateField = Object.keys(error.keyValue || {})[0];
        if (duplicateField === 'email') {
            message = 'User already exists with the given email';
        } else if (duplicateField === 'mobileNumber') {
            message = 'User already exists with the given mobile number';
        } else {
            message = 'Duplicate value already exists';
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
};

module.exports = errorHandler;
