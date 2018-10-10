const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Email = mongoose.model('emails');
const Draft = mongoose.model('drafts');

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
      toDomain: user.domain,
      deletedSent: false
    });

    const sent = await Email.find({ userId, deletedFrom: false });

    const drafts = await Draft.find({ userId });

    res.send({ inbox, sent, drafts });
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
      userId,
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

  app.delete('/api/email', async (req, res) => {
    const userId = getUserIdFromRequest(req);
    let { emailId, origin } = req.body;

    let emailToDelete = await Email.findById(emailId);
    if (origin === 'sent') emailToDelete.set({ deletedFrom: true });
    else if (origin === 'inbox') emailToDelete.set({ deletedSent: true });

    emailToDelete = await emailToDelete.save().catch(err => {
      return { success: false, error: err.message };
    });

    if (!emailToDelete) {
      return res.status(400).json({ success: false, error: 'Email not found' });
    }

    if (emailToDelete.deletedFrom && emailToDelete.deletedSent) {
      console.log('Cleaning up email');
      await Email.findOneAndRemove({ _id: emailId });
    }

    res.send({ success: true });
  });

  app.post('/api/email/draft', async (req, res) => {
    const userId = getUserIdFromRequest(req);
    let { to, subject, body, edit, draftId } = req.body;
    to = decodeURIComponent(to);
    subject = decodeURIComponent(subject);
    body = decodeURIComponent(body);

    console.log(to, subject, body, edit, draftId);

    let userFrom = await User.findById(userId);

    if (!userFrom) {
      return res
        .status(400)
        .json({ success: false, error: '"From" user is not found' });
    }

    if (edit) {
      const editDraft = await Draft.findByIdAndUpdate(draftId, {
        $set: { to, subject, body }
      });
    } else {
      const newDraft = await new Draft({
        userId,
        fromUsername: userFrom.username,
        fromDomain: userFrom.domain,
        to,
        subject,
        body
      })
        .save()
        .catch(err => {
          return { success: false, error: err.message };
        });
    }

    res.send({ success: true });
  });

  app.delete('/api/email/draft', async (req, res) => {
    const userId = getUserIdFromRequest(req);
    let { draftId } = req.body;

    let draftToDelete = await Draft.findOneAndRemove({ _id: draftId });

    if (!draftToDelete) {
      return res.status(400).json({ success: false, error: 'Draft not found' });
    }

    res.send({ success: true });
  });
};

function getUserIdFromRequest(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, keys.jwtSecret);
  return decoded.sub;
}
