const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const domains = require('../config/domains');

const User = mongoose.model('users');
const usernameConfig = {
  min: 4,
  max: 16
};
const passwordConfig = {
  min: 4,
  max: 24
};

module.exports = app => {
  app.post('/auth/register', async (req, res) => {
    let { username, domain, password } = req.body;
    username = username.trim();
    domain = domain.trim();

    // Check if domain is supported
    if (!domains.includes(domain)) {
      return res.status(400).json({
        success: false,
        error: `Domain ${domain} is not supported`
      });
    }

    // Validate username
    const validUsernameError = validateUsername(username);
    if (validUsernameError) {
      return res.status(400).json(validUsernameError);
    }

    // Validate password
    const validPasswordError = validatePassword(password);
    if (validPasswordError) {
      return res.status(400).json(validPasswordError);
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username, domain });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: 'Username is already taken' });
    }

    // Create new user in database
    const user = await new User({
      username,
      domain,
      password
    })
      .save()
      .catch(err => {
        return res.status(409).json({
          success: false,
          error: err.message
        });
      });

    return res.status(200).json({
      success: true,
      error: null
    });
  });

  app.post('/auth/login', async (req, res) => {
    let { username, domain, password } = req.body;
    username = username.trim();
    domain = domain.trim();
    password = password.trim();

    // Check if domain is supported
    if (!domains.includes(domain)) {
      return res
        .status(400)
        .json({ success: false, error: `Domain ${domain} is not supported` });
    }

    // Look for user in database
    const user = await User.findOne({ username, domain });

    // If no user found, return error
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Confirm password with hash in database
    const valid = await user.checkPassword(password);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, error: 'Incorrect password' });
    }

    // Create JSON web token
    const payload = {
      sub: user._id
    };
    const token = jwt.sign(payload, keys.jwtSecret);
    const data = {
      name: user.username
    };

    res.json({
      success: true,
      message: 'Successful login',
      token,
      user: data
    });
  });

  app.get('/auth/domains', (req, res) => {
    return res.json({
      domains
    });
  });
};

// HELPER FUNCTIONS

// Username validation
function validateUsername(username) {
  const errorName = 'InvalidUsername';

  if (username === '') {
    return { success: false, error: 'Username is empty' };
  } else if (!username.match(/^[0-9a-zA-z.]+$/)) {
    return { success: false, error: 'Username is not alphanumeric' };
  } else if (
    username.length < usernameConfig.min ||
    username.length > usernameConfig.max
  ) {
    return {
      success: false,
      error: `Username is not ${usernameConfig.min}-${
        usernameConfig.max
      } characters`
    };
  }

  return null;
}

// Password validation
function validatePassword(password) {
  const errorName = 'InvalidPassword';

  if (password === '') {
    return { success: false, error: 'Password is empty' };
  } else if (!password.match(/^[0-9a-zA-Z]+$/)) {
    return { success: false, error: 'Password is not alphanumeric' };
  } else if (
    password.length < passwordConfig.min ||
    password.length > passwordConfig.max
  ) {
    return {
      success: false,
      error: `Password is not ${passwordConfig.min}-${
        passwordConfig.max
      } characters`
    };
  }

  return null;
}
