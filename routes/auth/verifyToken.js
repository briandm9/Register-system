const express = require('express');
const router = express.Router();
const requireLoginToken = require('../../middlewares/authMiddleware');

router.get('/', requireLoginToken, (req, res) =>{
    return res.status(200).json({
        success: true,
        user: req.user
    });
})

module.exports = router;