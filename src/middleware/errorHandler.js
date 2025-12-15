// Custom error class for application errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    let { statusCode, message } = err;

    // Default error
    if (!statusCode) {
        statusCode = 500;
    }

    if (!message) {
        message = 'Internal server error';
    }

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        statusCode,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    // Handle Prisma errors
    if (err.code) {
        if (err.code === 'P2002') {
            statusCode = 409;
            const field = err.meta?.target?.[0] || 'field';
            message = `Duplicate value for ${field}`;
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        } else if (err.code === 'P2003') {
            statusCode = 400;
            message = 'Foreign key constraint failed';
        } else if (err.code.startsWith('P2')) {
            statusCode = 400;
            message = 'Database error';
        }
    }

    // Send error response
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

// 404 handler
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Route not found',
        path: req.url,
        method: req.method
    });
}

// Async error wrapper to catch errors in async route handlers
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler,
    asyncHandler
};
