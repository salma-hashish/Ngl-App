import { AppError } from "./error.js";

export function globalErrorHandler(err, req, res, next) {
    console.log(err, req.correlationId);

    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            message: `Invalid ${err.path}: ${err.value}`,
            success: false,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(400).json({
            message: `Duplicate value for ${field}`,
            success: false,
        });
    }

    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            message: msg,
            success: false,
        });
    }

    if (err.name === 'ZodError') {
        const msg = err.issues ? err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') : 'Validation failed';
        return res.status(400).json({
            message: msg,
            success: false,
        });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: err.message,
            success: false,
        });
    }

    return res.status(500).json({
        error: "Something went wrong",
        success: false,
    });
}

export function invalidRoute(req, res, next) {
    next(new AppError('invalid routing', 404));
}


