const express = require('express');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router
  .route('/')
  .get(bookingController.getAllBookings);
router
  .route('/:id')
  .get(bookingController.getBooking)
  .post(bookingController.createBooking);
  
module.exports = router;