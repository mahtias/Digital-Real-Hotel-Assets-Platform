import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UserRole } from '@prisma/client';

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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token); // TokenPayload | null

    if (!decoded) {
      req.user = undefined;
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

    // Attach correct Prisma types to req.user
    req.user = {
      userId: decoded.userId,
      role: decoded.role as UserRole,
    };

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

    const userRole = req.user.role;

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
 * Optional authentication
 * Attaches user if token exists, but does not reject unauthenticated requests
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
      const decoded = verifyToken(token); // TokenPayload | null

      if (decoded) {
        req.user = {
          userId: decoded.userId,
          role: decoded.role as UserRole,
        };
      }
    }

    next();
  } catch {
    next();
  }
};

/**
 * Verify email middleware
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

  next();
};

/**
 * Verify KYC middleware
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

  next();
};
