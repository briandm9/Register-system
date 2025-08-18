const { generateActivationToken } = require('../utils/jwt');
const sendActivationMail = require('./mails/sendActivationMail');
const canSendEmail = require('../utils/emailThrottle');

const handleResendActivationEmail = async (user) => {
  if (!canSendEmail(user.lastEmailSent)) {
    return { status: 429, sucess: false, message: 'Email limit reached. Please wait before requesting another email' };
  }

  const newToken = generateActivationToken(user._id);
  const mailResult = await sendActivationMail(user.username, user.email, newToken);

  if (!mailResult.success) {
    return { status: 500, sucess: false, message: 'New token generated, but failed to send activation email' };
  }

  user.lastEmailSent = new Date();
  await user.save();

  return { status: 200, sucess: true, message: 'A new activation email has been sent' };
};

module.exports = handleResendActivationEmail;