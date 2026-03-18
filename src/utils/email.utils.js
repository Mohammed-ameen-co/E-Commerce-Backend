const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendSignUpEmail(userEmail, name, verificationLink) {
  const subject = "Welcome to E-Commerce!";

  // Plain text version (for non-HTML email clients)
  const text = `Hi ${name},\n\nWelcome to E-Commerce! Please verify your email: ${verificationLink}`;

  // HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      <h2 style="color: #4A90E2;">Welcome to E-Commerce!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We’re excited to have you on board. To get started and access all our features, please confirm your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
      </div>

      <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #4A90E2;">${verificationLink}</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p><strong>Account Details:</strong></p>
      <ul>
        <li><strong>Username:</strong> ${userEmail}</li>
        <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <p style="font-size: 0.8em; color: #777;">If you did not create an account with us, please ignore this email.</p>
      
      <p>Best regards,<br>
      <strong>The E-Commerce Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendForgotPasswordEmail(userEmail, name, resetLink) {
  const subject = "Reset Your Password - E-Commerce";

  const text = `Hi ${name},

We received a request to reset your password.

Click the link below to reset your password:
${resetLink}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

Best regards,
E-Commerce Team
`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      
      <h2 style="color: #E94E77;">Password Reset Request</h2>
      
      <p>Hi <strong>${name}</strong>,</p>
      
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #E94E77; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #E94E77;">${resetLink}</p>

      <p style="margin-top: 20px;">
        <strong>Important:</strong> This link will expire in 15 minutes for security reasons.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p style="font-size: 0.9em;">
        If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
      </p>

      <p>Best regards,<br>
      <strong>The E-Commerce Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendSignUpEmail,
  sendForgotPasswordEmail,
};
