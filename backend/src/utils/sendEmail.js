import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  let user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || "";
  let pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS || "";

  // Sanitize user and pass (strip leading/trailing whitespace and all internal spaces in app passwords)
  user = user.trim();
  pass = pass.replace(/\s+/g, "");

  if (user && pass) {
    const isGmail = user.toLowerCase().endsWith("@gmail.com") || host.includes("gmail.com");

    const transporterConfig = isGmail
      ? {
          service: "gmail",
          auth: {
            user,
            pass,
          },
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        };

    const transporter = nodemailer.createTransport(transporterConfig);

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
