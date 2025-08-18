const express = require('express');
const router = express.Router();
const registerValidation = require('../../validations/registerValidation');
const handleValidation = require('../../middlewares/handleValidations');
const { generateActivationToken } = require('../../utils/jwt');
const createUser = require('../../controllers/userController');
const sendActivationMail = require('../../services/mails/sendActivationMail');

router.post('/', registerValidation, handleValidation, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await createUser(username, email, password);
    const activationToken = generateActivationToken(newUser._id);
    const mailResult = await sendActivationMail(username, email, activationToken);

    if (!mailResult.success) {
      return res.status(500).json({
        sucess: false,
        message: 'Account created but failed to send activation email'
      });
    }

    res.status(201).json({
      sucess: true,
      message: 'Account created successfully. Please check your email to activate your account'
    });

  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({
        sucess: false,
        message: 'This email adress is already registered'
      });
    }

    return res.status(500).json({
      sucess: false,
      message: 'An unexpected error occurred while creating your account'
    });
  }
});

module.exports = router;