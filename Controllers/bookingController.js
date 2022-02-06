const Booking = require('../Models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);

exports.createBooking =  catchAsync(async (req, res, next) => {
        const newUser = await Booking.create({
          workshop: req.params.id,
          user: req.body.user, //req.user.id
          mem1: req.body.mem1,
          mem2: req.body.mem2,
          mem3: req.body.mem3,
          mem4: req.body.mem4,
          price: req.body.price
        });
        console.log('Booking created');
        res.status(200).json({
            status: 'success',
            message: 'Booking Created',
        });
    });
