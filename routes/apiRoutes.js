const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = mongoose.model('users');

module.exports = app => {
  app.get('/api/', (req, res) => {
    return res.send({ hello: 'world' });
  });

  app.get('/api/current_user', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, keys.jwtSecret);
    const userId = decoded.sub;

    const userData = await User.findById(userId);

    const user = {
      username: userData.username,
      domain: userData.domain
    };

    return res.json({ success: true, user });
  });
};
