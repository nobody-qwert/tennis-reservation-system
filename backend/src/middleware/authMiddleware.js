const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const { rows } = await db.query(
        'SELECT id, username, email, is_admin FROM users WHERE id = $1',
        [decoded.id]
      );

      // Check if user was found
      if (!rows[0]) {
        console.error('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }

      // Set user in request object
      req.user = rows[0];
      
      // Continue to the next middleware/route handler
      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token found
  console.error('No token provided');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

const admin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next();
  } else {
    console.error('Admin access denied for user:', req.user?.username);
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
