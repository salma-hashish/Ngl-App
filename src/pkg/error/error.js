export class AppError extends Error {
    statusCode;
    isOperational;

    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad Request') {
        return new AppError(message, 400);
    }

    static unauthorized(message = 'Unauthorized') {
        return new AppError(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return new AppError(message, 403);
    }

    static notFound(message = 'Not Found') {
        return new AppError(message, 404);
    }

    static conflict(message = 'Conflict') {
        return new AppError(message, 409);
    }
}