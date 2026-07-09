import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import prisma from '../config/database';


interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(" AUTH DEBUG:", req.path);
    let token: string | undefined = undefined;

    // 1. CHECK COOKIE TOKEN FIRST
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. FALLBACK TO AUTHORIZATION HEADER
    if (!token) {
      token = extractTokenFromHeader(req.headers.authorization) ?? undefined;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    // Load the user from Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    if (!(user as any).isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated' });
      return;
    }

    // Attach final user to req
    req.user = {
      userId: decoded.userId,
      role: decoded.role, // keep string as is
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
};
