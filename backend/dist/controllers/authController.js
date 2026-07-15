"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDRABalance = exports.adminLogin = exports.resetPassword = exports.forgotPassword = exports.getProfile = exports.resendVerificationEmail = exports.verifyEmail = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const resendEmail_1 = require("../utils/resendEmail");
const draService_1 = require("../services/draService");
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
        try {
            await (0, resendEmail_1.sendResendEmail)({
                to: email,
                subject: "Confirm your DIGIREAL account",
                html: ` <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">
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
  </div>`,
            });
        }
        catch (emailError) {
            console.error("Registration email failed:", emailError.message);
        }
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
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Contact support."
            });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET, { expiresIn: '7d' });
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                kycStatus: user.kycStatus,
                walletAddress: user.walletAddress
            }
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
        const referer = req.headers.referer || "";
        let FRONTEND_URL = "https://digirealassets.io";
        if (referer.startsWith("http://localhost") || referer.startsWith("http://127.0.0.1")) {
            FRONTEND_URL = referer.split("/").slice(0, 3).join("/");
        }
        if (!token) {
            return res.redirect(`${FRONTEND_URL}/email-verification-failed`);
        }
        const user = await database_1.default.user.findFirst({
            where: { verificationToken: token }
        });
        if (!user) {
            return res.redirect(`${FRONTEND_URL}/email-verification-failed`);
        }
        if (user.verificationExpires && user.verificationExpires < new Date()) {
            return res.redirect(`${FRONTEND_URL}/email-verification-failed`);
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
        return res.redirect(`${FRONTEND_URL}/email-verified`);
    }
    catch (error) {
        console.error("Verify email error:", error);
        return res.redirect("https://digirealassets.io/email-verification-failed");
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
        await (0, resendEmail_1.sendResendEmail)({
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
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }
    try {
        const user = await database_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                kycStatus: true,
                walletAddress: true,
                createdAt: true,
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error("GET /me error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
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
        await (0, resendEmail_1.sendResendEmail)({
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
        console.log("RESET PASSWORD REQUEST");
        console.log("Body:", req.body);
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Reset token is required",
            });
        }
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required",
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }
        const user = await database_1.default.user.findFirst({
            where: {
                resetPasswordToken: token,
            },
        });
        if (!user) {
            console.warn("Reset password failed: invalid token");
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }
        if (user.resetPasswordExpires &&
            user.resetPasswordExpires < new Date()) {
            console.warn(`Reset token expired for user ${user.email}`);
            await database_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            });
            return res.status(400).json({
                success: false,
                message: "Reset token expired",
            });
        }
        console.log(`Resetting password for user: ${user.email}`);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        console.log("Password hashed successfully");
        await database_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        console.log(`Password reset completed for ${user.email}`);
        return res.status(200).json({
            success: true,
            message: "Password successfully reset. You may now log in.",
        });
    }
    catch (error) {
        console.error("================================");
        console.error("RESET PASSWORD ERROR");
        console.error("Message:", error?.message);
        console.error("Stack:", error?.stack);
        console.error("Full Error:", error);
        console.error("================================");
        return res.status(500).json({
            success: false,
            message: "Server error resetting password",
            error: process.env.NODE_ENV === "development"
                ? error?.message
                : undefined,
        });
    }
};
exports.resetPassword = resetPassword;
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }
        const user = await database_1.default.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        const INVALID = "Invalid credentials or insufficient permissions";
        if (!user) {
            console.warn(`[ADMIN LOGIN FAILED] unknown email: ${email} from IP: ${ip}`);
            return res.status(401).json({ success: false, message: INVALID });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            console.warn(`[ADMIN LOGIN FAILED] wrong password for: ${email} from IP: ${ip}`);
            return res.status(401).json({ success: false, message: INVALID });
        }
        if (user.role !== "ADMIN") {
            console.warn(`[ADMIN LOGIN BLOCKED] non-admin attempt: ${email} (role: ${user.role}) from IP: ${ip}`);
            return res.status(403).json({ success: false, message: INVALID });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
        console.info(`[ADMIN LOGIN] ${email} from IP: ${ip}`);
        return res.json({
            success: true,
            message: "Admin login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("[ADMIN LOGIN ERROR]", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.adminLogin = adminLogin;
const getDRABalance = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const user = await database_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: { walletAddress: true },
        });
        if (!user?.walletAddress) {
            return res.json({ success: true, balance: 0, walletAddress: null });
        }
        const balance = await draService_1.draService.getBalance(user.walletAddress);
        return res.json({ success: true, balance, walletAddress: user.walletAddress });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch DRA balance" });
    }
};
exports.getDRABalance = getDRABalance;
//# sourceMappingURL=authController.js.map