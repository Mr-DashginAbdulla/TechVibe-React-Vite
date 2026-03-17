const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  // Check if SMTP credential exists, otherwise mock the email.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("\n==============================================");
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Text:\n${text}`);
    console.log("==============================================\n");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT, // true for 465, false for other ports
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: process.env.SMTP_FROM || '"TechVibe" <noreply@techvibe.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendEmail;
