"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireKYCVerified = exports.requireEmailVerified = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            req.user = undefined;
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
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
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
                required: roles,
                current: userRole
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = (0, jwt_1.verifyToken)(token);
            if (decoded) {
                req.user = {
                    userId: decoded.userId,
                    role: decoded.role,
                };
            }
        }
        next();
    }
    catch {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireEmailVerified = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
        return;
    }
    next();
};
exports.requireEmailVerified = requireEmailVerified;
const requireKYCVerified = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
        return;
    }
    next();
};
exports.requireKYCVerified = requireKYCVerified;
//# sourceMappingURL=auth.middleware.js.map