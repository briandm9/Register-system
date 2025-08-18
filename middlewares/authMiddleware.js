const { verifyTypedToken } = require('../utils/jwt');
const User = require('../models/user');

const requireLogin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is missing'
    });
  }  
  
  try {
    const payload = verifyTypedToken(token, 'login');
    const user = await User.findById(payload.userId);
  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  
	  req.user = { username: user.username, email: user.email };
    next();
      
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }  
};

module.exports = requireLogin;