const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load in config keys
const keys = require('./config/keys');

// Load in mongoose models
require('./models/User');
require('./models/Email');

// Set up connection to database
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

const app = express();
const PORT = process.env.PORT || 5000;

// Set up body parsing
app.use(bodyParser.json());

// Set up authentication check middleware for api
const authCheckMiddleware = require('./middlewares/authCheck');
app.use('/api', authCheckMiddleware);

// Set up routes
require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    console.log('fallback');
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
