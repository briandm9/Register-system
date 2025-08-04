const { body } = require('express-validator');
const blockMongoOperators = require('../utils/blockMongoOp');

const loginValidation = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),

  body('password')
    .isString().withMessage('Password must be a string')
    .custom(blockMongoOperators)
    .trim()
    .escape()
];

module.exports = loginValidation;