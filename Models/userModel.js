const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a username.'],
        //unique: true
    },
    email: {
        type: String,
        required: [true, 'Provide an email for your account.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, `Please provide a valid email`]
    },
    password: {
        type: String,
        required: [true, 'Provide a password.'],
        minlength: 6,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // runs on 'SAVE' and 'CREATE' and not on 'UPDATE'
          validator: function (el) {
            return el === this.password;
          },
          message: `Password doesn't match!!`
        }
    },
    uid:{
      type: String,
      default: function(){
        return this.email.substring(0,2)+ Date.now().toString(36).substring(3);
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    DateOfCreation: {
        type: Date,
        default: Date.now,
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
  
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// User Schema Methods
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;