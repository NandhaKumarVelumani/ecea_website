const mongoose = require('mongoose');
const timezone = require('mongoose-timezone');

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
    default: true
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'workshop',
    select: 'name'
  });
  next();
});

bookingSchema.plugin(timezone, { paths: ['createdAt.default'] });
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
