// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
}

/**
 * Global error handler
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401);
  }

  // PostgreSQL errors
  if (err.code === "23505") {
    // Unique violation
    const message = "Duplicate value. This record already exists.";
    error = new AppError(message, 400);
  }

  if (err.code === "23503") {
    // Foreign key violation
    const message = "Referenced record does not exist";
    error = new AppError(message, 400);
  }

  if (err.code === "23502") {
    // Not null violation
    const message = "Required field is missing";
    error = new AppError(message, 400);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
}

/**
 * Validation error formatter
 */
export function validationError(errors: any) {
  return new AppError(
    Object.values(errors)
      .map((err: any) => err.message)
      .join(", "),
    400
  );
}

/**
 * Handle unhandled promise rejections
 */
export function handleUnhandledRejection() {
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  });
}

/**
 * Handle uncaught exceptions
 */
export function handleUncaughtException() {
  process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error);
    // Exit process
    process.exit(1);
  });
}