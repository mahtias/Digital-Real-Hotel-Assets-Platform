"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const existingUser = await database_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await database_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: client_1.UserRole.USER,
                kycStatus: client_1.KycStatus.PENDING
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                kycStatus: true,
                walletAddress: true,
                createdAt: true
            }
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
            walletAddress: user.walletAddress || null
        }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
            walletAddress: user.walletAddress || null
        }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                kycStatus: user.kycStatus,
                walletAddress: user.walletAddress
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    return res.json({ user: req.user });
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map