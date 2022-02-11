const express = require('express');
const bookingController = require('../Controllers/bookingController');
const authenticateToken = require('../Controllers/authenticateToken');

const router = express.Router();
router.post('/:id',authenticateToken.authenticateToken,bookingController.createBooking);
//ADMIN AUTH REQUIRED HERE(should remove below routes in final version!)
router
  .route('/')
  .get(bookingController.getAllBookings);
router
  .route('/:id')
  .get(bookingController.getBooking);
  
module.exports = router;