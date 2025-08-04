const jwt = require('jsonwebtoken');

const generateActivationToken = (userId) => jwt.sign({ userId, tokenType: 'activation' }, process.env.JWT_SECRET, { expiresIn: '24h' });

const generatePasswordToken = (userId) => jwt.sign({ userId, tokenType: 'passwordReset' }, process.env.JWT_SECRET, { expiresIn: '30m' });

const generateLoginToken = (userId) => jwt.sign({ userId, tokenType: 'login' }, process.env.JWT_SECRET, { expiresIn: '1d' });

const decodeToken = (token) => jwt.decode(token);

const verifyTypedToken = (token, expectedType) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.tokenType !== expectedType) {
    throw new Error(`Invalid token type: expected "${expectedType}"`);
  }
  return decoded;
};

module.exports = {
  generateActivationToken,
  generatePasswordToken,
  generateLoginToken,
  decodeToken,
  verifyTypedToken
};