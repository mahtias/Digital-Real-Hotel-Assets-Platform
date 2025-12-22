import { UserRole } from '../models/User';

export interface RegisterDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface WalletLoginDTO {
  walletAddress: string;
  signature?: string;
  message?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;  // issued at
  exp?: number;  // expiration
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  walletAddress?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface VerifyEmailDTO {
  token: string;
}
