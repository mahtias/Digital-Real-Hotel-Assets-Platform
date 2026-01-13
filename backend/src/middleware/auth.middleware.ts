import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '@prisma/client';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check cookie first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    // Attach user
    req.user = {
      userId: decoded.userId,
      role: UserRole[decoded.role as keyof typeof UserRole],
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };
};
