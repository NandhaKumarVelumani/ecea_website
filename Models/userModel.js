const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const timezone = require('mongoose-timezone');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a username.'],
    },
    email: {
        type: String,
        required: [true, 'Provide an email for your account.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, `Please provide a valid email`]
    },
    phone: {
      type: String,
      required: [true,'Provide a Phone number'],
      unique: true,
      minlength:[10,`Please provide valid 10 digit mobile number`],
      maxlength:[10,`Please provide valid 10 digit mobile number`],
      validate: [validator.isNumeric ,`Please provide a valid number`]
    },
    college:{
      type: String,
      required: [true,'Mention your college']
    },
    year:{
      type: String,
      required: [true,'Mention your year of study'],
      enum:['1st','2nd','3rd','4th','5th']
    },
    grad:{
      type: String,
      enum:['ug','pg'],
      required: [true,'Mention whether ug or pg']
    },
    rollno:{
      type: String,
      unique: true,
      validate: [validator.isNumeric ,`Please provide a valid roll number`]
    },
    password: {
        type: String,
        required: [true, 'Provide a password.'],
        minlength: [6,`Minimum password length is 6`],
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
        return this.email.substring(0,1)+ Date.now().toString(36).substring(2);
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

userSchema.plugin(timezone, { paths: ['DateofCreation.default'] });

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

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(changedTimeStamp, JWTTimestamp);
    //true means password has changed
    return JWTTimestamp < changedTimeStamp;
  }

  //false means password has not changed
  return false;
};

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;