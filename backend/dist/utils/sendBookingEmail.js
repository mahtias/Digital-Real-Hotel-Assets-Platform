"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingEmail = sendBookingEmail;
const resendEmail_1 = require("../utils/resendEmail");
const pdfkit_1 = __importDefault(require("pdfkit"));
const stream_buffers_1 = __importDefault(require("stream-buffers"));
const qrcode_1 = __importDefault(require("qrcode"));
async function sendBookingEmail({ to, bookingCode, hotelName, hotelLocation, hotelDescription, checkIn, checkOut, total, txHash, attachInvoice = false }) {
    try {
        if (!to) {
            console.warn("No valid user email for booking", bookingCode);
            return;
        }
        const attachments = [];
        if (attachInvoice) {
            const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
            const writableStream = new stream_buffers_1.default.WritableStreamBuffer();
            doc.pipe(writableStream);
            doc.image('assets/logo.png', 50, 45, { width: 100 })
                .fillColor('#D4AF37')
                .fontSize(20)
                .text('DigiReal Assets', 160, 65);
            doc.moveDown(2);
            doc.fontSize(24)
                .fillColor('#D4AF37')
                .text('Booking Invoice', { align: 'center' })
                .moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#D4AF37').stroke();
            doc.moveDown();
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
            if (hotelDescription) {
                doc.moveDown()
                    .fillColor('#ccc')
                    .font('Times-Italic')
                    .fontSize(11)
                    .text(hotelDescription);
            }
            const bookingUrl = `https://digirealassets.io/booking/${bookingCode}`;
            const qrImageData = await qrcode_1.default.toDataURL(bookingUrl);
            doc.image(qrImageData, 400, doc.y, { width: 100 });
            doc.end();
            attachments.push({
                filename: `Invoice-${bookingCode}.pdf`,
                content: writableStream.getContents(),
                contentType: 'application/pdf'
            });
        }
        await (0, resendEmail_1.sendResendEmail)({
            to,
            subject: "Booking Confirmed",
            html: `
    <div style="font-family:Arial,sans-serif;background:#0f1117;color:#fff;padding:20px;border-radius:10px;">
      <h2 style="color:#D4AF37;text-align:center;">
        Booking Successful!
      </h2>

      <div style="background:#1e1f29;padding:20px;border-radius:10px;margin-top:10px;">
        <p><strong>Confirmation Code:</strong> ${bookingCode}</p>
        <p><strong>Hotel:</strong> ${hotelName}</p>
        ${hotelLocation ? `<p><strong>Location:</strong> ${hotelLocation}</p>` : ""}
        ${hotelDescription ? `<p><em>${hotelDescription}</em></p>` : ""}
        <p><strong>Check In:</strong> ${checkIn}</p>
        <p><strong>Check Out:</strong> ${checkOut}</p>
        <p><strong>Total:</strong> $${total}</p>

        <p>
          <strong>Transaction:</strong><br/>
          <a href="https://sepolia.etherscan.io/tx/${txHash}">
            ${txHash}
          </a>
        </p>
      </div>

      <p style="text-align:center;color:#ccc;">
        Thank you for booking with DigiRealAssets.
      </p>
    </div>
  `,
            attachments,
        });
        console.log("Booking email sent to:", to, "and BCC to admin");
    }
    catch (err) {
        console.error("Booking email failed:", err);
    }
}
//# sourceMappingURL=sendBookingEmail.js.map