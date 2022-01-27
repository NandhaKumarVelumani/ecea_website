var nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });
var hbs = require('nodemailer-express-handlebars');
const path = require('path');

/*Using gmail
var transport = nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user: process.env.USER,    //'web.assisst.ecea@gmail.com',
            pass: process.env.PASSWORD //'websupport@ECEA'
        }
    }
) */
//Below uses Mailjet
var transport = nodemailer.createTransport(
    {
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure:false,
        auth:{
            user: process.env.MAILJET_USER,    
            pass: process.env.MAILJET_PASS 
        }
    }
)

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
    transport.sendMail({
      from: 'VISION | ECEA <web_assist@eceaceg.in>',
      to: email,
      subject: `Sign up successful, ${name}`,
    template: 'temp2',
    context: {uid:uid,name:name}
    }).catch(err => console.log(err));
  };
