import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const message = {
      from: `"${process.env.FROM_NAME || 'Pixora'}" <${process.env.FROM_EMAIL || user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } else {
    console.log("-----------------------------------------");
    console.log("⚠️ EMAIL CREDENTIALS NOT CONFIGURED");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("-----------------------------------------");
    return { mock: true, to: options.email };
  }
};

export default sendEmail;
