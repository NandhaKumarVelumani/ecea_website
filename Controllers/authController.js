const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const nodemailer = require('../utils/nodemailer');
const catchAsync = require('../utils/catchAsync');
const User = require('../Models/userModel');
const AppError = require('../utils/appError');

const signToken = (data) =>
  jwt.sign({uid: data.uid}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createSendToken = (data, statusCode, res) => {
  const token = signToken(data);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), //into milliseconds
    httpOnly: true 
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
      status: 'success',
      uid : data.uid,
      token
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      college: req.body.college,
      year: req.body.year,
      grad: req.body.grad,
      rollno: req.body.rollno,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    }
    
    const userexist = await User.findOne({email: userData.email});

    if(userexist){
      return next(
        new AppError(
          'User Already Exist...',
          400
        )
      );
    }

    const newUser = await User.create(userData);  

    nodemailer.sendConfirmationEmail(
      req.body.name,
      req.body.email,
      newUser.uid
    );

    createSendToken({uid: newUser.uid}, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
      return next(new AppError('User doesn\'t exist...', 400));
    }

    const valid = await user.correctPassword(password, user.password);
    if(!valid){
      return next(new AppError('Invalid Password Or Email Id...', 400));
    }
    createSendToken({uid: user.uid}, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email id', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    // await new Email(user, resetURL).sendPasswordReset();
    // console.log(resetURL);

    res.status(200).json({
      status: 'success',
      // message: 'Token sent to email'
      url: resetURL
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired and the user still exists, then reset the password
  if (!user) {
    return next(new AppError('Token is invalid or it has expired.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property of the users
  // It is done as a pre hook 'save'

  // 4) Log the user in, send JWT
  createSendToken({uid: user.uid}, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if(!req.user){
    return next(new AppError('Please Login To Continue...', 400));
  }

  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current Password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect Current Password.', 401));
  }

  // 3) If so, Update the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //findByIdandUpdate() does not work

  // 4) Log user in using JWT
  createSendToken({uid: user.uid}, 200, res);
});
