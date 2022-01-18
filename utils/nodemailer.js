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

/*MAILJET_USER =de532f01da19b81c21e417049ae3b027
MAILJET_PASS =a4c951d1bfa34be3cd967e784c990aea
SMTP_HOST=in-v3.mailjet.com
SMTP_PORT=587 */

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
      from: 'ECEA CEG <web_assist@eceaceg.in>',
      to: email,
      subject: `Sign up successful, ${name}`,
    template: 'temp2',
    context: {uid:uid,name:name}
    }).catch(err => console.log(err));
  };
