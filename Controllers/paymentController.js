const razorpay = require('razorpay');
const crypto = require("crypto");

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPaymentLink = catchAsync(async (req, res, next) => {
    console.log('Creating Payment Link...');
    //var instance = new razorpay({ key_id: 'rzp_test_zU5FEWlErmCH2F', key_secret: 'wHUrX88aDKems326mcul6oBz' });
    var instance = new razorpay({ key_id: process.env.RAZORPAY_KEY_ID , key_secret: process.env.RAZORPAY_KEY_SECRET });
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
        "callback_url": `${req.protocol}://${req.get('host')}/api/v1/payments/verify`,
        "callback_method": "get",
        "options": {
          "checkout": {
            "name": "ECEA"
          }
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            id: response.id,
            short_url: response.short_url
        }
    });
});
exports.verify = catchAsync(async function(req, res, next) {
  body = req.query.razorpay_payment_link_id + '|' +req.query.razorpay_payment_link_reference_id + '|' +
                    req.query.razorpay_payment_link_status + '|' +
                    req.query.razorpay_payment_id;

 let expectedSignature = await crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
             .update(body.toString())
             .digest('hex');

 // Compare the signatures
 if(expectedSignature === req.query.razorpay_signature) {
       console.log('Payment verified successfully!');
   }
 res.status(200).json({
       status: 'success',
       message: 'Payment verfied',
   });
})