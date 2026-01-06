"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getProfile = exports.resendVerificationEmail = exports.verifyEmail = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const mailer_1 = require("../utils/mailer");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const existingUser = await database_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomUUID();
        const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
        const user = await database_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: client_1.UserRole.USER,
                kycStatus: client_1.KycStatus.PENDING,
                isEmailVerified: false,
                verificationToken,
                verificationExpires
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                kycStatus: true,
                walletAddress: true,
                createdAt: true,
                verificationToken: true
            }
        });
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        await mailer_1.mailer.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Confirm your DIGIREAL account",
            html: `
  <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">
    <div style="
      max-width:520px;
      margin:auto;
      background:#ffffff;
      padding:30px;
      border-radius:12px;
      border:1px solid #e5e5e5;
      text-align:center;
    ">

      <img src="https://yourdomain.com/logo.jpg"
           alt="DigirealAssets" 
           style="width:120px;margin-bottom:20px;" />

      <h2 style="color:#333;margin-bottom:20px;">Hi there,</h2>

      <p style="color:#555;font-size:15px;line-height:1.6;">
        Welcome to <strong>DigirealAssets</strong>!  
        Please verify your email address by clicking the button below:
      </p>

      <a href="${verifyUrl}"
        style="
          display:inline-block;
          margin-top:25px;
          background:#f3c623;
          color:#000;
          padding:14px 26px;
          font-size:16px;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">
        Verify your email
      </a>

      <p style="color:#999;font-size:13px;margin-top:25px;">
        This link will expire in 15 minutes.
      </p>

      <p style="color:#999;font-size:13px;margin-top:10px;">
        If you did not create a DigirealAssets account, you can ignore this email.
      </p>

      <hr style="border:0;border-top:1px solid #eee;margin:30px 0;"/>

      <p style="color:#bbb;font-size:12px;text-align:center;">
        © ${new Date().getFullYear()} DigirealAssets • All rights reserved.
      </p>

    </div>
  </div>
`
        });
        return res.status(201).json({
            message: "Registration successful. Please check your email to verify your account.",
            user
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
            walletAddress: user.walletAddress || null
        }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
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
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const user = await database_1.default.user.findFirst({
            where: { verificationToken: token }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        if (user.verificationExpires && user.verificationExpires < new Date()) {
            return res.status(400).json({ message: "Token expired" });
        }
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                verificationToken: null,
                verificationExpires: null,
                emailVerifiedAt: new Date()
            }
        });
        return res.json({ message: "Email successfully verified" });
    }
    catch (error) {
        console.error("Verify email error:", error);
        res.status(500).json({ message: "Server error verifying email" });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        const newToken = crypto_1.default.randomUUID();
        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                verificationToken: newToken,
                verificationExpires: expires
            }
        });
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`;
        await mailer_1.mailer.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Resend: Confirm your DIGIREAL account",
            html: `
  <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">
    <div style="
      max-width:520px;
      margin:auto;
      background:#ffffff;
      padding:30px;
      border-radius:12px;
      border:1px solid #e5e5e5;
      text-align:center;
    ">

      <img src="https://yourdomain.com/logo.jpg" 
           alt="DigirealAssets" 
           style="width:120px;margin-bottom:20px;" />

      <h2 style="color:#333;margin-bottom:20px;">Hi there,</h2>

      <p style="color:#555;font-size:15px;line-height:1.6;">
        Welcome to <strong>DigirealAssets</strong>!  
        Please verify your email address by clicking the button below:
      </p>

      <a href="${verifyUrl}"
        style="
          display:inline-block;
          margin-top:25px;
          background:#f3c623;
          color:#000;
          padding:14px 26px;
          font-size:16px;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">
        Verify your email
      </a>

      <p style="color:#999;font-size:13px;margin-top:25px;">
        This link will expire in 15 minutes.
      </p>

      <p style="color:#999;font-size:13px;margin-top:10px;">
        If you did not create a DigirealAssets account, you can ignore this email.
      </p>

      <hr style="border:0;border-top:1px solid #eee;margin:30px 0;"/>

      <p style="color:#bbb;font-size:12px;text-align:center;">
        © ${new Date().getFullYear()} DigirealAssets • All rights reserved.
      </p>

    </div>
  </div>
`
        });
        return res.json({ message: "Verification email resent" });
    }
    catch (error) {
        console.error("Resend error:", error);
        res.status(500).json({ message: "Server error resending verification" });
    }
};
exports.resendVerificationEmail = resendVerificationEmail;
const getProfile = async (req, res) => {
    return res.json({ user: req.user });
};
exports.getProfile = getProfile;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({ message: "If that email is registered, a reset link was sent." });
        }
        const resetToken = crypto_1.default.randomUUID();
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await database_1.default.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await mailer_1.mailer.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset your DIGIREAL password",
            html: `
        <h2>Password Reset Request</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}" 
           style="padding:10px 20px;background:#f3c623;color:#000;text-decoration:none;border-radius:6px;">
           Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `
        });
        return res.json({
            message: "If that email is registered, a reset link was sent."
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error requesting password reset" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const user = await database_1.default.user.findFirst({
            where: {
                resetPasswordToken: token,
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Reset token expired" });
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
        return res.json({ message: "Password successfully reset. You may now log in." });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error resetting password" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map