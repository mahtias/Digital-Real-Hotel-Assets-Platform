import { CustomJWTPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJWTPayload;
    }
  }
}

export {};
