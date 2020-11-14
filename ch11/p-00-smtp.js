const nodeMailer = require('nodemailer');

const credentials = require('./credentials.json');

const mailTransport = nodeMailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  },
});

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: 'Hans-Tsai xxxxxx@gmail.com',  // 提醒: from參數必須要帶入真實存在的email帳號, 建議跟上面的 auth.user 用相同的E-mail sender 帳號
      to: '請輸入目標收件者的E-mail address',
      subject: '測試 Nodemailer Email Service',
      text: 'Thank you for booking your trip with Meadowlark Travel.  ' +
      'We look forward to your visit!',
    })
    console.log('E-mail 已成功寄出: ', result);
  } catch (err) {
    console.log('無法寄出E-mail ' + err.message);
  }
}; 

go();

// 如果遇到 550 error when sending email through nodemailer, 可參考以下文章
// 連結: https://stackoverflow.com/questions/45854397/nodemailer-unable-to-send-mails-from-nodejs