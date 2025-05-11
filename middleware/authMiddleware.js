const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.protect = (req, res, next) => {
  const token = req.cookies.token; 
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control middleware
module.exports.authorizeRoles = function (...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      console.log('User Role:', req.user.role);  // Debug log

      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
      
    }
    next();
  };
};
