import "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        role: string;
        walletAddress?: string | null;
      };
    }
  }
}