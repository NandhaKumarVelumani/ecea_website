var nodemailer = require('nodemailer');
//require('dotenv').config({ path: './config.env' });
var hbs = require('nodemailer-express-handlebars');
const path = require('path');

var transport = nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user: process.env.USER, //'web.assisst.ecea@gmail.com',
            pass: process.env.PASSWORD //'websupport@ECEA'
        }
    }
)

//template

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./Views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./Views'),
    extName: ".handlebars",
}

transport.use('compile',hbs(handlebarOptions));

//send out email

module.exports.sendConfirmationEmail = (name, email,uid) => {
    console.log("Check");
    transport.sendMail({
      from: process.env.USER,
      to: email,
      subject: "WELCOME TO ECEA",
    template: 'temp2',
    context: {uid:uid}
    }).catch(err => console.log(err));
  };
