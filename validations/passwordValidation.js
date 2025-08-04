const { body } = require('express-validator');
const blockMongoOperators = require('../utils/blockMongoOp');

const passwordValidation = [
    body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
    .custom(blockMongoOperators)
    .trim()
    .escape()
];

module.exports = passwordValidation;