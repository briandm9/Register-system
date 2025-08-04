const transporter = require('./mailTransporter');
const logEmailError = require('../../utils/logger');

const sendActivationMail = async (username, email, token) => {
  const url = `http://${process.env.HOST}:${process.env.PORT}/activate?token=${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Activate your account",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #2a7ae2;">Hello ${username}!</h2>
      <p style="font-size: 16px;">Thank you for signing up! To activate your account, please click the button below:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #2a7ae2; color: white;
      text-decoration: none; border-radius: 4px; font-weight: bold;">
        ACTIVATE ACCOUNT
      </a>
      <p style="font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
    </div>
  `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    logEmailError(email, token, err.message);
    return { success: false };
  }
};

module.exports = sendActivationMail;