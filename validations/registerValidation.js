const { body } = require('express-validator');
const blockMongoOperators = require('../utils/blockMongoOp');

const registerValidation = [
  body('username')
	.isString().withMessage('Username must be a string')
	.notEmpty().withMessage('Username is required')
	.matches(/^[\w\s]+$/).withMessage('Username must contain only letters, numbers, or spaces')
	.custom(blockMongoOperators)
	.trim()
	.escape(),

  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),

  body('password')
	.isString().withMessage('Password must be a string')
	.isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
	.custom(blockMongoOperators)
	.trim()
	.escape()
];

module.exports = registerValidation;