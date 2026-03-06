"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const authenticate = async (req, res, next) => {
    try {
        console.log("🔐 AUTH DEBUG START:", req.path);
        let token;
        if (req.cookies?.token) {
            console.log("🍪 COOKIE TOKEN FOUND:", req.cookies.token?.slice(0, 20) + "...");
            token = req.cookies.token;
        }
        if (!token) {
            const authHeader = req.headers.authorization;
            console.log("📡 HEADER:", !!authHeader, authHeader?.slice(0, 20) + "...");
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                console.log("🔓 BEARER TOKEN:", token.slice(0, 20) + "...");
            }
        }
        if (!token) {
            console.log(" NO TOKEN FOUND");
            res.status(401).json({ success: false, message: 'No token provided' });
            return;
        }
        console.log("🔍 VERIFYING TOKEN...");
        const decoded = (0, jwt_1.verifyToken)(token);
        console.log("✅ DECODED:", decoded);
        if (!decoded) {
            console.log("❌ DECODED NULL");
            res.status(401).json({ success: false, message: 'Invalid or expired token' });
            return;
        }
        req.user = {
            userId: decoded.userId,
            role: client_1.UserRole[decoded.role],
        };
        console.log("🎉 USER ATTACHED:", req.user.userId);
        next();
    }
    catch (error) {
        console.error("💥 AUTH ERROR:", error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map