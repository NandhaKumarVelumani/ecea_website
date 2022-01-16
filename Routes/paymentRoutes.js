const express = require('express');
const paymentController = require('../Controllers/paymentController');

const router = express.Router();

router.get('/generatePaymentLink', paymentController.createPaymentLink);
router.get('/verify', paymentController.verify);
module.exports = router;