import { mailer } from "../utils/mailer";
import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";
import QRCode from "qrcode";

interface BookingEmailProps {
  to: string;
  bookingCode: string;
  hotelName: string;
  hotelLocation?: string;
  hotelDescription?: string;
  checkIn: Date | string;
  checkOut: Date | string;
  total: number;
  txHash: string;
  attachInvoice?: boolean;
}

export async function sendBookingEmail({
  to,
  bookingCode,
  hotelName,
  hotelLocation,
  hotelDescription,
  checkIn,
  checkOut,
  total,
  txHash,
  attachInvoice = false
}: BookingEmailProps) {
  try {
    if (!to) {
      console.warn("No valid user email for booking", bookingCode);
      return;
    }

    const attachments: any[] = [];

    // ----------------------------
    // Create branded PDF invoice if requested
    // ----------------------------
    if (attachInvoice) {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writableStream = new streamBuffers.WritableStreamBuffer();

      doc.pipe(writableStream);

      // Logo
      doc.image('assets/logo.png', 50, 45, { width: 100 })
        .fillColor('#D4AF37')
        .fontSize(20)
        .text('DigiReal Assets', 160, 65);

      doc.moveDown(2);

      // Title
      doc.fontSize(24)
        .fillColor('#D4AF37')
        .text('Booking Invoice', { align: 'center' })
        .moveDown();

      // Draw divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#D4AF37').stroke();

      doc.moveDown();

      // Booking Info Table
      doc.fontSize(12).fillColor('#FFFFFF');
      const bookingDetails = [
        ['Booking Code', bookingCode],
        ['Hotel', hotelName],
        ['Location', hotelLocation || '-'],
        ['Check-in', String(checkIn)],
        ['Check-out', String(checkOut)],
        ['Total', `$${total}`],
        ['Transaction Hash', txHash]
      ];

      const tableTop = doc.y;
      const itemX = 50;
      const valueX = 200;

      bookingDetails.forEach(([label, value], i) => {
        doc.fillColor('#fbbf24').text(label, itemX, tableTop + i * 20);
        doc.fillColor('#FFFFFF').text(value, valueX, tableTop + i * 20, { link: label === 'Transaction Hash' ? `https://etherscan.io/tx/${value}` : undefined });
      });

      doc.moveDown(bookingDetails.length / 3);

      // Hotel description
        if (hotelDescription) {
  doc.moveDown()
     .fillColor('#ccc')
     .font('Times-Italic')  // Use italic font
     .fontSize(11)
     .text(hotelDescription);
}

      // QR code for booking link
      const bookingUrl = `https://digirealassets.io/booking/${bookingCode}`;
      const qrImageData = await QRCode.toDataURL(bookingUrl);
      doc.image(qrImageData, 400, doc.y, { width: 100 });

      doc.end();

      attachments.push({
        filename: `Invoice-${bookingCode}.pdf`,
        content: writableStream.getContents(),
        contentType: 'application/pdf'
      });
    }

    // ----------------------------
    // Send Email
    // ----------------------------
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      bcc: process.env.SMTP_USER, // admin copy
      subject: "Booking Confirmed ",
      html: `
        <div style="font-family: 'Arial', sans-serif; background:#0f1117; color:#fff; padding:20px; border-radius:10px;">
          <h2 style="color:#D4AF37; text-align:center;">Booking Successful!</h2>
          <div style="background:#1e1f29; padding:20px; border-radius:10px; margin-top:10px;">
            <p style="color:#fbbf24;"><strong>Confirmation Code:</strong> ${bookingCode}</p>
            <p><strong>Hotel:</strong> ${hotelName}</p>
            ${hotelLocation ? `<p><strong>Location:</strong> ${hotelLocation}</p>` : ''}
            ${hotelDescription ? `<p style="font-style:italic; opacity:0.85;">${hotelDescription}</p>` : ''}
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Transaction:</strong></p>
            <p style="word-break:break-all;"><a href="https://etherscan.io/tx/${txHash}" style="color:#D4AF37;">${txHash}</a></p>
          </div>
          <br/>
          <p style="text-align:center; color:#ccc;">Thank you for booking with DigiRealAssets.</p>
        </div>
      `,
      attachments
    });

    console.log("Booking email sent to:", to, "and BCC to admin");
  } catch (err) {
    console.error("Booking email failed:", err);
  }
}