const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailSchema = new Schema({
  // recepient of email
  to: {
    type: String,
    trim: true
  },
  subject: String,
  body: String
});

mongoose.model('emails', emailSchema);
