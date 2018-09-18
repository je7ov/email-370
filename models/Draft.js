const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const draftSchema = new Schema({
  userId: ObjectId,
  fromUsername: String,
  fromDomain: String,
  to: String,
  subject: String,
  body: String
});

mongoose.model('drafts', draftSchema);
