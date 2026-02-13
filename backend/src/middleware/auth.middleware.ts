import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '@prisma/client';


interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("🔐 AUTH DEBUG START:", req.path);

    let token: string | undefined;

    // 1. Check cookie first
    if (req.cookies?.token) {
      console.log("🍪 COOKIE TOKEN FOUND:", req.cookies.token?.slice(0,20) + "...");
      token = req.cookies.token;
    }

    // 2. Fallback to Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      console.log("📡 HEADER:", !!authHeader, authHeader?.slice(0,20) + "...");
      
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log("🔓 BEARER TOKEN:", token.slice(0,20) + "...");
      }
    }

    if (!token) {
      console.log(" NO TOKEN FOUND");
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    console.log("🔍 VERIFYING TOKEN...");
    const decoded = verifyToken(token);
    console.log("✅ DECODED:", decoded);

    if (!decoded) {
      console.log("❌ DECODED NULL");
      res.status(401).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    // Attach user
    req.user = {
      userId: decoded.userId,
      role: UserRole[decoded.role as keyof typeof UserRole],
    };

    console.log("🎉 USER ATTACHED:", req.user.userId);
    next();
  } catch (error: any) {
    console.error("💥 AUTH ERROR:", error.message);
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
