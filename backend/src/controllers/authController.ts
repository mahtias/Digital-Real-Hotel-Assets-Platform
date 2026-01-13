import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { UserRole, KycStatus } from '@prisma/client';
import crypto from 'crypto';
import { mailer } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// REGISTER (with email verify)


export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: UserRole.USER,
        kycStatus: KycStatus.PENDING,
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

    // FIXED verify URL
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await mailer.sendMail({
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

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN (BLOCK IF EMAIL NOT VERIFIED)

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Block unverified accounts
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in."
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        walletAddress: user.walletAddress || null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // -----------------------------------------------------
    // ADD COOKIE HERE — this was missing earlier
    // -----------------------------------------------------
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,                 
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000       // 7 days
    });

    // -----------------------------------------------------
    // Return login response
    // -----------------------------------------------------
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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// VERIFY EMAIL

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationExpires: null,
        emailVerifiedAt: new Date()
      }
    });

    return res.json({ message: "Email successfully verified" });

  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error verifying email" });
  }
};

// RESEND EMAIL VERIFY

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const newToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: newToken,
        verificationExpires: expires
      }
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`;

    await mailer.sendMail({
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

  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ message: "Server error resending verification" });
  }
};


// GET PROFILE

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  try {
    const user = await prisma.user.findUnique({
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

  } catch (error) {
    console.error("GET /me error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, do not reveal if user exists
      return res.json({ message: "If that email is registered, a reset link was sent." });
    }

    const resetToken = crypto.randomUUID();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await mailer.sendMail({
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

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error requesting password reset" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await prisma.user.findFirst({
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return res.json({ message: "Password successfully reset. You may now log in." });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error resetting password" });
  }
};
