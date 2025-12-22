import { generateToken, verifyToken } from './utils/jwt';
import { UserRole } from './models/User';

// Test token generation
const testUserId = '123e4567-e89b-12d3-a456-426614174000';
const token = generateToken(testUserId, UserRole.USER);

console.log('Generated Token:', token);

// Test token verification
const decoded = verifyToken(token);
console.log('Decoded Token:', decoded);
console.log('Role Type:', typeof decoded?.role);
console.log('Is Valid Role:', Object.values(UserRole).includes(decoded?.role!));
