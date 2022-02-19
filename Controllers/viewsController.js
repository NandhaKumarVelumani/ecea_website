const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getHome = catchAsync((req, res, next) => {
    res.status(200).render('base');
})