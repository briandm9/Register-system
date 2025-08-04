const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const loginValidation = require('../../validations/loginValidation');
const handleValidation = require('../../middlewares/handleValidations');
const User = require('../../models/user');
const { generateLoginToken } = require('../../utils/jwt');

router.post('/', loginValidation, handleValidation, async (req ,res) =>{
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                error:{
                    code: 'LOGIN_USER_ERROR',
                    message: 'Login failed, user not found'
                }
            });
        }

        if (!user.isActive) {
            return res.status(400).json({
                error:{
                    code: 'LOGIN_USER_NOTACTIVE',
                    message: 'Login failed, user is not activated yet'
                }
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error:{
                    code: 'LOGIN_INVALID_CREDENTIALS',
                    message: 'Login failed, invalid credentials'
                }
            });
        }

        const token = generateLoginToken(user._id);
        return res.status(200).json({ message: 'Login successful', token });

    } catch(error){
        return res.status(500).json({
            error:{
                code: 'LOGIN_SERVICE_ERROR',
                message: 'Login service failed'
            }
        });
    }
})

module.exports = router;