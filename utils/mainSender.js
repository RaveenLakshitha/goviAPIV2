"use strict";
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cf9ac577d9cfbb",
      pass: "7375a04ff1b17c",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    //text: options.message, // plain text body
    html: options.message,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
