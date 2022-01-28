const app = require('./app');
const mongoose = require('mongoose');



process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION SHUTTING DOWN!!!');
  console.log(err.name, err.message, err);
  process.exit(1);
});



/*
const url = process.env.DATABASE_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Local DB Connection successful...');
  })
  .catch(err => {
    console.log('Local DB not connected...')
  });
*/


/*
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
*/
process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. Shutting down gracefully!!!');
  server.close(() => {
    console.log('Process terminated...');
  });
});