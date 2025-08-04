const canSendEmail = (lastSent, limitInHours = 12) => {
  if (!lastSent) return true;

  const now = new Date();
  const limit = new Date(lastSent.getTime() + limitInHours * 60 * 60 * 1000);

  return now > limit;
};

module.exports = canSendEmail;