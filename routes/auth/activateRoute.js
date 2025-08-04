const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const { decodeToken, verifyTypedToken } = require('../../utils/jwt');
const handleResendActivationEmail = require('../../services/activationService');

router.get('/', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      error:{
        code: 'ACTIVATION_TOKEN_ERROR',
        message: 'Activation failed, token is missing'
      }
    });
  }

  try {
    const payload = verifyTypedToken(token, 'activation');
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({
        error:{
          code: 'ACTIVATION_USER_ERROR',
          message: 'Activation failed, user not found'
        }
      });
    }

    if (user.isActive) {
      return res.status(403).json({
        error:{
          code: 'ACTIVATION_ALREADY_ACTIVE',
          message: 'Your account is already activated'
        }
      });
    }         

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: 'Your account has been successfully activated' });

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      try {
        const decoded = decodeToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
          return res.status(404).json({
            error:{
              code: 'ACTIVATION_USER_ERROR',
              message: 'Activation failed, user not found'
            }
          });
        }

        if (user.isActive) {
          return res.status(403).json({
            error:{
              code: 'ACTIVATION_ALREADY_ACTIVE',
              message: 'Your account is already activated'
            }
          });
        }

        const result = await handleResendActivationEmail(user);
        return res.status(result.status).json({ message: result.message });
        
      } catch (mailError) {
        return res.status(500).json({
          error:{
            code: 'ACTIVATION_MAIL_RESEND_ERROR',
            message: 'Token expired and failed to send a new activation email'
          }
        });
      }
    }

    if (err.message.startsWith('Invalid token type')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(400).json({
      error:{
        code: 'ACTIVATION_TOKEN_INVALID',
        message: 'Activation failed, token is invalid'
      }
    });
  }
});

module.exports = router;