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
      from: '"Hans-Tsai" xxxxxx@gmail.com',  // 提醒: from參數必須要帶入真實存在的email帳號, 建議跟上面的 auth.user 用相同的E-mail sender 帳號
      to: 'xxxxxx@gmail.com, ' + '"收件者名稱" <yyyyyy@gmail.com>',  // 注意! 當有多位收件者時,每一個'email address, ' 的後面一定要加一個逗號 "," 不然會error 
      subject: '測試 Nodemailer Email Service (multiple E-maile receivers)',
      text: '大家午安',
    })
    console.log('E-mail 已成功寄出: ', result);
  } catch (err) {
    console.log('無法寄出E-mail ' + err.message);
  }
};

go();
// 如果遇到 550 error when sending email through nodemailer, 可參考以下文章
// 連結: https://stackoverflow.com/questions/45854397/nodemailer-unable-to-send-mails-from-nodejs