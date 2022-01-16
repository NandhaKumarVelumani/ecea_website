const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);
//Add Protect Middleware here 
router.patch('/updateMyPassword', userController.updatePassword);
router.patch('/updateMe', userController.updateMe);
//ADMIN AUTH REQUIRED HERE
router
  .route('/')
  .get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);
module.exports = router;
