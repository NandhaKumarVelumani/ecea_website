const express = require('express');
const eventbookingController = require('../Controllers/eventbookingController');

const router = express.Router();

router
  .route('/')
  .get(eventbookingController.getAllEventBookings);
router
  .route('/:id')
  .get(eventbookingController.getEventBooking)
  .post(eventbookingController.createEventBooking);
  
module.exports = router;