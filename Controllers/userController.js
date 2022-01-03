const User = require('../Models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
    console.log('Inside signup');
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    res.status(200).json({
        status: 'success',
        message: 'Account Created'
    })
});
