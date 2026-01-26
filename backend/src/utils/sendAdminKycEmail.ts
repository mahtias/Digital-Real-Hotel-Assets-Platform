import nodemailer from "nodemailer";

export async function sendAdminKycEmail(user: any) {
  try {
    const transporter = nodemailer.createTransport({
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
  to: "dra@digirealassets.io",
  subject: "New KYC Submission Pending Approval",
  html: `
    <h3>New KYC Submission</h3>
    <p>A new user has submitted KYC and is waiting for approval.</p>

    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
    <p><strong>Email:</strong> ${user.email}</p>

    <p>Please review the KYC:</p>
      <a href="https://my-backend-api-8oe4.onrender.com/digirealassets.io/admin"
    target="_blank" 
    rel="noopener noreferrer"
    style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:4px;">
    Open Admin Dashboard
    </a>

    <br /><br />
    <p>Local testing:</p>
    <a href="http://localhost:5173/admin" target="_blank" rel="noopener noreferrer">
    </a>
  `
});


    console.log("Admin KYC email sent.");
  } catch (error) {
    console.error("Failed to send admin KYC email:", error);
  }
}
