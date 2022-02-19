const razorpay = require('razorpay');
const crypto = require("crypto");

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../Models/bookingModel');
const User= require('../Models/userModel');
const Workshop = require('../Models/workshopModel');

exports.createPaymentLink = catchAsync(async (req, res, next) => {
    console.log('Creating Payment Link...');
    const workshop = await Workshop.findById(req.params.id);
    var instance = new razorpay({ key_id: process.env.RAZORPAY_KEY_ID , key_secret: process.env.RAZORPAY_KEY_SECRET });
    const response = await instance.paymentLink.create({
        "amount": parseInt(workshop.price),
        "currency": "INR",
        "description": "Vision'22 Workshop Payment",
        "customer": {
          "name": req.user.name,
          "email": req.user.email,
          "contact": req.user.phone
        },
        "notify": {
          "sms": false,
          "email": true
        },
        "reminder_enable": true,
        //"callback_url": `${req.protocol}://${req.get('host')}/api/v1/payments/verify`,
        //"callback_method": "get",
        notes: {
          "workshopId": workshop.id,
          "user": req.user.id, 
          "mem1":req.user.uid,
          "mem2": req.body.mem2,
          "mem3": req.body.mem3,
          "mem4": req.body.mem4,
        },
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

const paymentCheckout = catchAsync(async session => {
  const workshopid = session.notes["workshopId"];
  await Booking.create({
    workshop: session.notes["workshopId"],
    user: session.notes["user"], 
    mem1: session.notes["mem1"],
    mem2: session.notes["mem2"],
    mem3: session.notes["mem3"],
    mem4: session.notes["mem4"],
    paid: true
  });
});

exports.webhookVerify = function(req, res, next) {
  const mySecret = "test123";
  const signature = req.headers["x-razorpay-signature"];
  try{
  if(razorpay.validateWebhookSignature(req.body, signature, mySecret)){
    console.log('Payment verified..creating booking...');
    paymentCheckout(JSON.parse(req.body).payload['payment'].entity);
    console.log('Booking created!');
  }
}
catch(err){
  return res.status(400).send(`Webhook error: ${err.message}`);
}
  res.status(200).json({
    received: true
});
};

/*exports.verify = catchAsync(async function(req, res, next) {
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
       message: 'Payment verified',
   });
})*/
