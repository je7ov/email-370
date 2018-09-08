const jwt = require('jsonwebtoken');
const User = require('mongoose').model('users');
const keys = require('../config/keys');

module.exports = (req, res, next) => {
  // If token doesn't exist, send 401 unauthorized
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const token = req.headers.authorization.split(' ')[1];

  // Decode jwt and get userId from payload
  const decoded = jwt.verify(token, keys.jwtSecret);
  const userId = decoded.sub;

  // Look for user by id, return 401 if not found
  const user = User.findById(userId);
  if (!user) {
    return res.status(401).end();
  }

  // User is found, continue to next
  return next();
};
