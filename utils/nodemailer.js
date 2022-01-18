var nodemailer = require('nodemailer');
require('dotenv/config')
var hbs = require('nodemailer-express-handlebars');
const path = require('path')
var transport = nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user: process.env.USER,
            pass: process.env.PASSWORD
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

module.exports.sendConfirmationEmail = (name, email) => {
    console.log("Check");
    transport.sendMail({
      from: process.env.USER,
      to: email,
      subject: "WELCOME TO ECEA",
    //   html: `<h1>Email Confirmation</h1>
    //       <h2>Hello ${name}</h2>
    //       <p>YOR ACCOUNT HAS BEEN SUCCESFULLY CREATED</p>
          
    //       </div>`,
    template: 'temp3',
    }).catch(err => console.log(err));
  };
