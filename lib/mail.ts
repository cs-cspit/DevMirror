import nodemailer from "nodemailer";

/**
 * Sends a verification email to the user.
 * @param email - Recipient email address
 * @param token - Verification token
 * @param baseUrl - Base URL of your app (from env)
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail email
        pass: process.env.EMAIL_PASS, // App password from Gmail
      },
    });

    // Verification link
    const verifyLink = `${baseUrl}/auth/verify-email?token=${token}&email=${email}`;

    // Email content
    const mailOptions = {
      from: `"Dev Mirror" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome to Dev Mirror!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
