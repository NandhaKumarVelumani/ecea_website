const express = require('express');
const paymentController = require('../Controllers/paymentController');
const authenticateToken = require('../Controllers/authenticateToken');

const router = express.Router();

router.post('/generatePaymentLink/:id', authenticateToken.authenticateToken, paymentController.createPaymentLink);
//router.post('/webhookVerify', paymentController.webhookVerify);
module.exports = router;