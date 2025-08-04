const canChangePassword = (lastChanged, limitInDays = 7) => {
  if (!lastChanged) return true;
  
  const now = new Date();
  const limit = new Date(lastChanged.getTime() + limitInDays * 24 * 60 * 60 * 1000);
  
  return now > limit;
};
  
module.exports = canChangePassword;