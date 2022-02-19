const express = require('express');
const workshopController = require('../Controllers/workshopController');

const router = express.Router();
  
  router.get('/',workshopController.getAllWorkshops);
  router.get('/:id',workshopController.getWorkshop);
    
  //ADMIN AUTH REQUIRED HERE(should remove below routes in final version!)
  router.post(workshopController.createWorkshop);
  router
    .route('/:id')
    .patch(workshopController.updateWorkshop)
    .delete(workshopController.deleteWorkshop);
module.exports = router;
