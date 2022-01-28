//core modules
const path = require('path');

//other-modules
const express = require('express');
const morgan = require('morgan');
const AdminBro = require('adminjs');
const AdminBroExpress = require('@adminjs/express');



//imported functions
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const paymentController = require('./Controllers/paymentController');
const userRouter = require('./Routes/userRoutes');
const paymentRouter = require('./Routes/paymentRoutes');
const workshopRouter = require('./Routes/workshopRoutes');
const eventRouter = require('./Routes/eventRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const mongoose = require('mongoose');
const AdminBroMongoose = require('@adminjs/mongoose');
const Booking = require('./Models/bookingModel');
AdminBro.registerAdapter(AdminBroMongoose);
const app = express();
const adminJs = new AdminBro({
    databases: [],
    rootPath: '/admin',
  })
const User = mongoose.model('user', { name: String, email: String, surname: String })
const adminJsOptions = {
  resources: [User],
}
const adminBro = new AdminBro(adminJsOptions);
const router = AdminBroExpress.buildRouter(adminBro);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));
app.post('/api/v1/payments/webhookVerify', express.raw({type:'application/json'}),paymentController.webhookVerify);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'Public')));
app.use(morgan('dev'));
app.use(adminBro.options.rootPath, router);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/workshops', workshopRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/bookings', bookingRouter);

// error handlers
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);

module.exports = app;
