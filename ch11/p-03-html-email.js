const nodemailer = require('nodemailer');

const credentials = require('./credentials.json');

const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  },
});

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"Hans-Tsai" <xxxxxxx@gmail.com>',
      to: 'xxxxx@gmail.com,' + '收件者名稱 yyyyy@gmail.com',
      subject: '測試 Nodemailer Email Service (html形式的Email)',
      html: '<h1>Meadowlark Travel</h1>\n<p>Thanks for book your trip with ' +
      'Meadowlark Travel.  <b>We look forward to your visit!</b>',
      text: '僅作為練習/測試用途,請勿回覆!',
    })
    console.log('E-mail 已成功寄出: ', result);
  } catch (err) {
    console.log('無法寄出E-mail ' + err.message);
  }
};

go();