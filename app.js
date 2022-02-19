//core modules
const path = require('path');

//other-modules
const express = require('express');
const morgan = require('morgan');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const mongoose = require('mongoose');
const AdminJSMongoose = require('@adminjs/mongoose');
const dotenv = require('dotenv');


//imported functions
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const paymentController = require('./Controllers/paymentController');
const userRouter = require('./Routes/userRoutes');
const paymentRouter = require('./Routes/paymentRoutes');
const workshopRouter = require('./Routes/workshopRoutes');
const eventRouter = require('./Routes/eventRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const eventbookingRouter = require('./Routes/eventbookingRoutes');
const User = require('./Models/userModel');
const Booking = require('./Models/bookingModel');
const Workshop = require('./Models/workshopModel');

dotenv.config({ path: './config.env' });
AdminJS.registerAdapter(AdminJSMongoose);
app = new express();
const AdminJSOptions = {resources: [
  {resource: Booking , options: { listProperties: ['workshop', 'user']}},
  { resource: User, options: { properties: {
    uid: {isVisible: { list: false, filter: false, show: true, edit: false }},
    password: {isVisible: { list: false, filter: false, show: false, edit: false }},
    passwordConfirm: {isVisible: { list: false, filter: false, show: false, edit: false }},
    passwordChangedAt: {isVisible: { list: false, filter: false, show: false, edit: false }},
    passwordResetToken: {isVisible: { list: false, filter: false, show: false, edit: false }},
    passwordResetExpires: {isVisible: { list: false, filter: false, show: false, edit: false }},
    DateOfCreation: {isVisible: { list: false, filter: false, show: true, edit: false }}
  }}},
  Workshop
]};
const adminJs = new AdminJS(AdminJSOptions);

const ADMIN = {
  email: 'admin@eceaceg.in',
  password: 'password',
}

// const router = AdminJSExpress.buildRouter(adminJs)
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN
    }
    return null
  },
  cookieName: 'adminjs',
  cookiePassword: 'somepassword',
});

app.use(adminJs.options.rootPath, router);

const run = async () => {
  const mongooseConnection = await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Local DB Connection successful...');
  })
  .catch(err => {
    console.log('Local DB not connected...')
  });;
  app.listen(process.env.PORT, () => console.log('AdminJs is under localhost:3000/admin'));
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

app.post('/api/v1/payments/webhookVerify', express.raw({type:'application/json'}),paymentController.webhookVerify);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'Public')));
app.use(morgan('dev'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/workshops', workshopRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/workshopBookings', bookingRouter);
app.use('/api/v1/eventBookings', eventbookingRouter);
// error handlers
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);
run();
module.exports = app;
