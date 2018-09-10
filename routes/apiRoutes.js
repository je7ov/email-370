const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Email = mongoose.model('emails');

module.exports = app => {
  app.get('/api/', (req, res) => {
    return res.send({ hello: 'world' });
  });

  app.get('/api/current_user', async (req, res) => {
    const userId = getUserIdFromRequest(req);

    const userData = await User.findById(userId);

    const user = {
      username: userData.username,
      domain: userData.domain
    };

    return res.json({ success: true, user });
  });

  app.get('/api/email', async (req, res) => {
    const userId = getUserIdFromRequest(req);
    const user = await User.findById(userId);

    const inbox = await Email.find({
      toUsername: user.username,
      toDomain: user.domain
    });

    const sent = await Email.find({
      fromUsername: user.username,
      fromDomain: user.domain
    });

    res.send({ inbox, sent });
  });

  app.post('/api/email', async (req, res) => {
    const userId = getUserIdFromRequest(req);
    let { username, domain, subject, body } = req.body;
    subject = decodeURIComponent(subject);
    body = decodeURIComponent(body);

    // Check if user sending message exists just in case
    let userFrom = await User.findById(userId);

    if (!userFrom) {
      return res
        .status(400)
        .json({ success: false, error: '"From" user is not found' });
    }

    // Check if user email is being sent to exists
    let userTo = await User.find({ username, domain });

    if (!userTo) {
      return res.status(400).json({
        success: false,
        error: `Account ${username}@${domain} does not exist`
      });
    }

    // Create new email in database
    const newEmail = await new Email({
      fromUsername: userFrom.username,
      fromDomain: userFrom.domain,
      toUsername: username,
      toDomain: domain,
      timeSent: moment().valueOf(),
      subject,
      body
    })
      .save()
      .catch(err => {
        return {
          success: false,
          error: err.message
        };
      });

    res.send({ success: true });
  });
};

function getUserIdFromRequest(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, keys.jwtSecret);
  return decoded.sub;
}
