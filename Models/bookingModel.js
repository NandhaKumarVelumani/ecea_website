const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');
const validator = require('validator');

const bookingSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Workshop',
    required: [true, 'Booking must belong to a Workshop!']
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
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Boolean,
    default: false
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate({path:'user',select: ['name','uid','email','phone']}).populate({
    path: 'workshop',
    select: 'name'
  });
  next();
});

bookingSchema.plugin(timezone, { paths: ['createdAt.default'] });
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
