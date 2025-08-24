import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}&email=${email}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use any SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DevMirror" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - DevMirror",
    html: `
      <h2>Welcome to DevMirror 🎉</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Email could not be sent");
  }
}
