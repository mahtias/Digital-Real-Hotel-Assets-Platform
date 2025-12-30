"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.AppError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
exports.validationError = validationError;
exports.handleUnhandledRejection = handleUnhandledRejection;
exports.handleUncaughtException = handleUncaughtException;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
        method: req.method,
    });
}
function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
    });
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new AppError(message, 404);
    }
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new AppError(message, 400);
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new AppError(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = new AppError(message, 401);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = new AppError(message, 401);
    }
    if (err.code === "23505") {
        const message = "Duplicate value. This record already exists.";
        error = new AppError(message, 400);
    }
    if (err.code === "23503") {
        const message = "Referenced record does not exist";
        error = new AppError(message, 400);
    }
    if (err.code === "23502") {
        const message = "Required field is missing";
        error = new AppError(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && {
            error: err,
            stack: err.stack,
        }),
    });
}
function validationError(errors) {
    return new AppError(Object.values(errors)
        .map((err) => err.message)
        .join(", "), 400);
}
function handleUnhandledRejection() {
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    });
}
function handleUncaughtException() {
    process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=errorHandler.js.map