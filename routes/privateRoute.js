const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/authMiddleware');

router.get('/', requireLogin, (req, res) =>{
    return res.status(200).json({ message: `Hello ${req.user.username}`});
})

module.exports = router;