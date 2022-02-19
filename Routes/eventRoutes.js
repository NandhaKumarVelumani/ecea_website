const express = require('express');
const eventController = require('../Controllers/eventController');

const router = express.Router();

router.get('/',eventController.getAllEvents);
router.get('/:id',eventController.getEvent);
  
//ADMIN AUTH REQUIRED HERE(should remove below routes in final version!)
router.post(eventController.createEvent);
router
  .route('/:id')
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);
module.exports = router;