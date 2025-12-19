import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this';

const JWT_EXPIRES_IN = '1h';
const JWT_REFRESH_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate access token
 */
export const generateToken = (userId: string, role: UserRole): string => {
  const payload: TokenPayload = {
    userId,
    role,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = {
    userId,
  };

  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    if (!Object.values(UserRole).includes(decoded.role)) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Decode token without verification
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    
    if (!decoded || !decoded.userId || !decoded.role) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * ✅ Extract token from Authorization header
 * Expects format: "Bearer <token>"
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  
  // Check if format is "Bearer <token>"
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};
