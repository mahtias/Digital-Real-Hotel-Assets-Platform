"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./utils/jwt");
const client_1 = require("@prisma/client");
const testUserId = '123e4567-e89b-12d3-a456-426614174000';
const token = (0, jwt_1.generateToken)(testUserId, client_1.UserRole.USER);
console.log('Generated Token:', token);
const decoded = (0, jwt_1.verifyToken)(token);
console.log('Decoded Token:', decoded);
console.log('Role Type:', typeof decoded?.role);
console.log('Is Valid Role:', Object.values(client_1.UserRole).includes(decoded?.role));
//# sourceMappingURL=test-auth.js.map