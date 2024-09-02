const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user exists
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ msg: 'Invalid token payload' });
    }

    // Fetch user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ msg: 'User does not exist' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Handle expired token
      if (req.user && req.user.userId) {
        const user = await User.findById(req.user.userId);
        if (user) {
          user.status = 'offline';
          await user.save();
        }
      }

      return res.status(401).json({ msg: 'Token has expired' });
    }

    console.error('Token is not valid:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
