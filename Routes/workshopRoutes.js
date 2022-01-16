const express = require('express');
const workshopController = require('../Controllers/workshopController');

const router = express.Router();

router
  .route('/')
  .get(workshopController.getAllWorkshops)
  .post(workshopController.createWorkshop);
router
  .route('/:id')
  .get(workshopController.getWorkshop)
  .patch(workshopController.updateWorkshop)
  .delete(workshopController.deleteWorkshop);
  
module.exports = router;
