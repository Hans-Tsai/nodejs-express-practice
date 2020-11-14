const nodemailer = require('nodemailer');
const htmlFormattedText = require('html-to-formatted-text');

// 提醒: module.exports 要把整個函式包住才正確!
module.exports = credentials => {
  const mailTransport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    auth: {
      user: credentials.sendgrid.user,
      pass: credentials.sendgrid.password,
    },
  })

const from = '"Hans-Tsai" <xxxxxx@gmail.com>';
const errorRecipient = 'yyyyyy@gmail.com';

return {
  send: (to, subject, html) => 
    mailTransport.sendMail({
    from,
    to,
    subject,
    html,
    text: htmlFormattedText(html),
    }),
  }
};
