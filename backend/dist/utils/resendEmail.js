"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResendEmail = sendResendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendResendEmail({ to, subject, html, attachments = [], }) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing");
    }
    if (!process.env.EMAIL_FROM) {
        throw new Error("EMAIL_FROM is missing");
    }
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        attachments,
    });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
//# sourceMappingURL=resendEmail.js.map