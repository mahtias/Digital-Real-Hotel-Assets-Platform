// backend/src/utils/resendEmail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResendEmail({
  to,
  subject,
  html,
 attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
 attachments?: any[];
}) {
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