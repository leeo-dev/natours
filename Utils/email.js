const nodemailer = require("nodemailer");
const sendEmail = async (options)=>{
  //01 Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //02) Define e-mail options
  const mailOption = {
    from: 'Leonardo Albuquerque <leeodesign@hotmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  }


  //03) Send email
  await transport.sendMail(mailOption);
}

module.exports = sendEmail;