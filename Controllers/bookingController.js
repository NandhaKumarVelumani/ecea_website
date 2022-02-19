const Booking = require('../Models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const paymentController = require('../Controllers/paymentController');

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);

