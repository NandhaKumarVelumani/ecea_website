const EventBooking = require('../Models/eventbookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getAllEventBookings = factory.getAll(EventBooking);
exports.getEventBooking = factory.getOne(EventBooking);

exports.createEventBooking =  catchAsync(async (req, res, next) => {
        const newUser = await EventBooking.create({
          event: req.params.id,
          user: req.user.id, //req.user.id
          mem1: req.body.mem1,
          mem2: req.body.mem2,
          mem3: req.body.mem3,
          mem4: req.body.mem4
        });
        console.log('Event Booking created');
        res.status(200).json({
            status: 'success',
            message: 'Event Booking Created',
        });
    });
