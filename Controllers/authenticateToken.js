const jwt = require("jsonwebtoken");

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../Models/userModel');

// Checks the validity of the jwt token
exports.authenticateToken = catchAsync(async (req, res, next) => {

    let token = undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    
    if(token === undefined || token === null){
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.uid);
    if (!currentUser)
        return next(
        new AppError('The user belonging to this token does not exist', 401)
        );

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
        new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    //grant access to protected route
    req.user = currentUser;

    // we do like this because then only we can access currentUser in the pug templates. The objects in the local object is available to all template that uses this method.
    res.locals.user = currentUser;

    next();
})
