//core modules
const path = require('path');

//other-modules
const express = require('express');
const morgan = require('morgan');

//imported functions
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const userRouter = require('./Routes/userRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'Public')));
app.use(morgan('dev'));

app.use('/api/v1/users', userRouter);

// error handlers
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);

module.exports = app;
