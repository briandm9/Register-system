const { body } = require('express-validator');

const emailValidation = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail()
];

module.exports = emailValidation;