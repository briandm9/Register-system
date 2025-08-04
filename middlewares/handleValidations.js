const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      msg: err.msg
    }));

    return res.status(400).json({
      message: 'Some fields contain invalid or missing information',
      errors: formattedErrors
    });
  }

  next();
}

module.exports = handleValidation;