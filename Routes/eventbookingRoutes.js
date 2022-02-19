const express = require('express');
const eventbookingController = require('../Controllers/eventbookingController');
const authenticateToken = require('../Controllers/authenticateToken');

const router = express.Router();

router.post('/bookEvent/:id',authenticateToken.authenticateToken,eventbookingController.createEventBooking);
//ADMIN AUTH REQUIRED HERE(should remove below routes in final version!)
router
  .route('/')
  .get(eventbookingController.getAllEventBookings);
router
  .route('/:id')
  .get(eventbookingController.getEventBooking);
  
module.exports = router;