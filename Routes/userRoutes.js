const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);
router.patch('/updateMyPassword', userController.updatePassword);

module.exports = router;
