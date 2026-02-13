"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminKycEmail = sendAdminKycEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendAdminKycEmail(user) {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: "admin@digirealassets.io",
            subject: "New KYC Submission Pending Approval",
            html: `
    <h3>New KYC Submission</h3>
    <p>A new user has submitted KYC and is waiting for approval.</p>

    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
    <p><strong>Email:</strong> ${user.email}</p>

    <p>Please review the KYC:</p>
      <a href="https://digirealassets.io/admin"
    target="_blank" 
    rel="noopener noreferrer"
    style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:4px;">
    Open Admin Dashboard
    </a>

  <br /><br />
    <p>Local testing:</p>
    <a href="http://localhost:5173/admin" target="_blank" rel="noopener noreferrer">
      Open Admin Dashboard
    </a>
  `
        });
        console.log("Admin KYC email sent.");
    }
    catch (error) {
        console.error("Failed to send admin KYC email:", error);
    }
}
//# sourceMappingURL=sendAdminKycEmail.js.map