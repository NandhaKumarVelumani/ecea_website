const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');
const authenticateToken = require('../Controllers/authenticateToken');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Add Protect Middleware here 
router.patch('/updateMyPassword', authenticateToken.authenticateToken, authController.updatePassword);
router.patch('/updateMe', authenticateToken.authenticateToken, userController.updateMe);

//ADMIN AUTH REQUIRED HERE
router
  .route('/')
  .get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
