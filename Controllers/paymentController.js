const razorpay = require('razorpay');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPaymentLink = catchAsync(async (req, res, next) => {
    console.log('Creating Payment Link...');
    var instance = new razorpay({ key_id: 'rzp_test_zU5FEWlErmCH2F', key_secret: 'wHUrX88aDKems326mcul6oBz' });
    
    const response = await instance.paymentLink.create({
        "amount": parseInt(req.body.amount),
        "currency": "INR",
        "description": req.body.description,
        "customer": {
          "name": req.body.name,
          "email": req.body.email,
          "contact": req.body.contact
        },
        "notify": {
          "sms": true,
          "email": true
        },
        "reminder_enable": true,
        // "callback_url": "https://example-callback-url.com/",
        "callback_method": "get"
    });

    res.status(200).json({
        status: 'success',
        data: {
            id: response.id,
            short_url: response.short_url
        }
    });
})