const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailSchema = new Schema({
  fromUsername: String,
  fromDomain: String,
  toUsername: String,
  toDomain: String,
  timeSent: Number,
  subject: String,
  body: String
});

mongoose.model('emails', emailSchema);
