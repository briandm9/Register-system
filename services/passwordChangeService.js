const { generatePasswordToken } = require('../utils/jwt');
const sendPasswordMail = require('./mails/sendPasswordMail');
const canSendEmail = require('../utils/emailThrottle');
const canChangePassword = require('../utils/changePwThrottle');
  
const handleSendPasswordEmail = async (user) => {
  if (!canSendEmail(user.lastEmailSent)) {
    return { status: 429, success: false, message: 'Email limit reached. Please wait before requesting another email' };
  }

  if (!canChangePassword(user.lastPasswordChange)){
    return { status: 429, success: false, message: 'Password update limit reached. Changes are allowed only once every 7 days' };
  }

  const newToken = generatePasswordToken(user._id);
  const mailResult = await sendPasswordMail(user.username, user.email, newToken);

  if (!mailResult.success) {
    return { status: 500, success: false, message: 'Failed to send reset password email' };
  }

  user.lastEmailSent = new Date();
  await user.save();

  return { status: 200, success: true, message: 'Password reset email has been sent' };
};

module.exports = handleSendPasswordEmail;