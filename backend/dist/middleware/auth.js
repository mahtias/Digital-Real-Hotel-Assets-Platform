"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
const authenticate = async (req, res, next) => {
    try {
        console.log(" AUTH DEBUG:", req.path);
        let token = undefined;
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization) ?? undefined;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided',
            });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
            return;
        }
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: insufficient permissions',
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map