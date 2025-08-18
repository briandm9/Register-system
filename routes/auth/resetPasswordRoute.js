const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { verifyTypedToken } = require('../../utils/jwt');
const passwordValidation = require('../../validations/passwordValidation');
const handleValidation = require('../../middlewares/handleValidations');
const canChangePassword = require('../../utils/changePwThrottle');

router.post('/', passwordValidation, handleValidation, async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({
      sucess: false,
      message: 'Token is missing'
    });
  }

  try {
    const payload = verifyTypedToken(token, 'passwordReset');
    const user = await User.findById(payload.userId);

    if (!user) {
        return res.status(404).json({
          sucess: false,
          message: 'User not found'
        });
    }

    if (!user.isActive) {
        return res.status(403).json({
          sucess: false,
          message: 'Account is not active, activate it before requesting new password'
        });
    }

    if (!canChangePassword(user.lastPasswordChange)){
      return res.status(429).json({
        sucess: false,
        message: 'Password update limit reached. Changes are allowed only once every 7 days'
      });
    }

    const comparation = await bcrypt.compare(password, user.password);

    if (comparation) {
      return res.status(400).json({
        sucess: false,
        message: 'New password cannot be the same as old password'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.lastPasswordChange = new Date();
    await user.save();

    return res.status(200).json({ 
      sucess: true, 
      message: 'Password changed successfully' 
    });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        return res.status(500).json({
          sucess: false,
          message: 'You cannot change password with an expired token'
        });
    }

    if (err.message.startsWith('Invalid token type')) {
      return res.status(400).json({
        sucess: false,
        message: err.message
      });
    }

    return res.status(400).json({
      sucess: false,
      message: 'Token is invalid'
    });
  }
});

module.exports = router;