const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');
const validator = require('validator');

const eventbookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Workshop',
    required: [true, 'Booking must belong to a event!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  mem1:{
    type: String,
    require: [true, 'Booking must have your uid.'], 
    minlength:[7,`Please provide valid 7 digit Vision id`],
    maxlength:[7,`Please provide valid 7 digit Vision id`],
    validate: [validator.isAlphanumeric ,`Please provide a valid vision id`]
  },
  mem2:{
    type: String,
    minlength:[7,`Please provide valid 7 digit Vision id`],
    maxlength:[7,`Please provide valid 7 digit Vision id`],
    validate: [validator.isAlphanumeric ,`Please provide a valid vision id`]
  },
  mem3:{
    type: String,
    minlength:[7,`Please provide valid 7 digit Vision id`],
    maxlength:[7,`Please provide valid 7 digit Vision id`],
    validate: [validator.isAlphanumeric ,`Please provide a valid vision id`]
  },
  mem4:{
    type: String,
    minlength:[7,`Please provide valid 7 digit Vision id`],
    maxlength:[7,`Please provide valid 7 digit Vision id`],
    validate: [validator.isAlphanumeric ,`Please provide a valid vision id`]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

eventbookingSchema.pre(/^find/, function(next) {
  this.populate({path:'user',select: ['name','uid','email','phone']}).populate({
    path: 'event',
    select: 'name'
  });
  next();
});

eventbookingSchema.plugin(timezone, { paths: ['createdAt.default'] });
const EventBooking = mongoose.model('EventBooking', eventbookingSchema);

module.exports = EventBooking;
