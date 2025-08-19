const transporter = require('./mailTransporter');

const sendPasswordMail = async (username, email, token) => {
    const url = `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/password-reset?token=${token}`;
  
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #2a7ae2;">Hello ${username}!</h2>
        <p style="font-size: 16px;">You requested a password reset. Click the button below to create a new password:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #e67e22; color: white;
        text-decoration: none; border-radius: 4px; font-weight: bold;">
          RESET PASSWORD
        </a>
        <p style="font-size: 14px; margin-top: 20px;">This link will expire in 30 minutes.</p>
      </div>
    `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };
  
  module.exports = sendPasswordMail;  