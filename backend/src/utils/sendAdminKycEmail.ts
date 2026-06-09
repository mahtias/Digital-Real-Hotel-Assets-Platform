import { sendResendEmail } from "./resendEmail";

export async function sendAdminKycEmail(user: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}) {
  try {
    await sendResendEmail({
      to: "admin@digirealassets.io",
      subject: "New KYC Submission Pending Approval",
      html: `
        <h3>New KYC Submission</h3>

        <p>A new user has submitted KYC and is waiting for approval.</p>

        <p><strong>Name:</strong>
          ${user.firstName ?? ""} ${user.lastName ?? ""}
        </p>

        <p><strong>Email:</strong> ${user.email}</p>

        <br/>

        <a
          href="https://digirealassets.io/admin"
          target="_blank"
          rel="noopener noreferrer"
          style="
            background:#007bff;
            color:#ffffff;
            padding:10px 15px;
            text-decoration:none;
            border-radius:4px;
          "
        >
          Open Admin Dashboard
        </a>
      `,
    });

    console.log("✅ Admin KYC email sent via Resend");
  } catch (error) {
    console.error("❌ Failed to send admin KYC email:", error);
  }
}