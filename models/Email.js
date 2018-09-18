const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const emailSchema = new Schema({
  userId: ObjectId,
  fromUsername: String,
  fromDomain: String,
  toUsername: String,
  toDomain: String,
  timeSent: Number,
  subject: String,
  body: String,
  deletedSent: { type: Boolean, default: false },
  deletedFrom: { type: Boolean, default: false }
});

mongoose.model('emails', emailSchema);
