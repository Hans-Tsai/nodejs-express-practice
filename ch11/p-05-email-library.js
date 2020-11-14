const credentials = require('./credentials.json');

const emailService = require('./lib/p-email')(credentials);

const email = 'xxxxxx@gmail.com';

if(email) {
  emailService.send(email, "Hood River tours on sale today!",
  "Get 'em while they're hot!")
    .then(() => {
      console.log('E-mail 已成功寄出: ')
    })
    .catch( (err) => {
      console.log('無法寄出E-mail ', err.message)
    })
} else {
  console.log('Edit this file, and specify an email address to test....')
};