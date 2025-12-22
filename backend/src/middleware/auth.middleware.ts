import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Define UserRole type
export type UserRole = 'user' | 'admin' | 'property_manager' | 'compliance_officer' | 'finance_manager';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required role(s)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: roles,
        current: userRole
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token exists but doesn't fail if not
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Verify email middleware
 * Checks if user's email is verified
 */
export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
    return;
  }

  // TODO: Check email verification status from database
  // For now, we'll just pass through
  next();
};

/**
 * Verify KYC middleware
 * Checks if user has completed KYC verification
 */
export const requireKYCVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
    return;
  }

  // TODO: Check KYC status from database
  // For now, we'll just pass through
  next();
};
