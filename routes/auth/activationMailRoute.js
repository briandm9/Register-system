const express = require('express');
const router = express.Router();
const emailValidation = require('../../validations/emailValidation');
const handleResendActivationEmail = require('../../services/activationService');
const handleValidation = require('../../middlewares/handleValidations');
const User = require('../../models/user');

router.post('/', emailValidation, handleValidation, async (req, res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error:{
                    code:'ACTIVATION_MAIL_USER_ERROR',
                    message: 'User not found'
                }
            });
        }

        if (user.isActive) {
            return res.status(403).json({
                error:{
                    code:'ACTIVATION_ALREADY_ACTIVE',
                    message: 'Your account is already activated'
                }
            });
        }

        const result = await handleResendActivationEmail(user);
        return res.status(result.status).json({ message: result.message });
        
    } catch(error){
        return res.status(500).json({
            error:{
                code: 'ACTIVATION_MAIL_SERVICE_ERROR',
                message: 'Activation email service failed'
            }
        });
    }
})

module.exports = router;