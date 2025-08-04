const express = require('express');
const router = express.Router();
const emailValidation = require('../../validations/emailValidation');
const handleSendPasswordEmail = require('../../services/passwordChangeService');
const handleValidation = require('../../middlewares/handleValidations');
const User = require('../../models/user');

router.post('/', emailValidation, handleValidation, async (req, res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error:{
                    code: 'RESET_PASSWORD_MAIL_ERROR',
                    message: 'User not found'
                }
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error:{
                    code: 'RESET_PASSWORD_MAIL_NOTACTIVE',
                    message: 'Account is not active, activate it before requesting new password'
                }
            });
        }

        const result = await handleSendPasswordEmail(user);
        return res.status(result.status).json({ message: result.message });
        
    } catch(error){
        return res.status(500).json({
            error:{
                code: 'RESET_PASSWORD_SERVICE_ERROR',
                message: 'Password reset mail service failed'
            }
        });
    }
})

module.exports = router;