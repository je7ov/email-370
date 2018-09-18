const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  // display name user goes by
  username: {
    type: String,
    trim: true,
    minlength: 4,
    maxlength: 16
  },
  // domain user's email account is in
  domain: {
    type: String,
    trim: true
  },
  // user's hashed password
  password: {
    type: String,
    minLength: 6
  }
});

userSchema.methods.checkPassword = async function(password) {
  const res = await bcrypt.compare(password, this.password).catch(err => {
    console.log(err.stack);
    return false;
  });

  return res;
};

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;

      return next();
    });
  });
});

mongoose.model('users', userSchema);
