const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');
const authenticateToken = require('../Controllers/authenticateToken');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signIn', authController.signIn);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Add Protect Middleware here 
router.use(authenticateToken.authenticateToken);
router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me',userController.getMe, userController.getUser);
//ADMIN AUTH REQUIRED HERE (should remove below routes in final version!)
router.get('/',userController.getAllUsers);
router.get('/:id',userController.getUser);

module.exports = router;
