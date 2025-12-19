import { Request } from 'express';
import { UserRole } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
  };
  token?: string;
}

// Export for use in other files
export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
