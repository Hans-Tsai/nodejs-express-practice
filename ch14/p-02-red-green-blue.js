const express = require('express');
const expressHandleabars = require('express-handlebars');
const app = express();

app.get('/rgb',
  (req, res, next) => {
  // 大約有1/3的機率的請求會回傳'紅色'
  if (Math.random() < 0.33) return next()
  res.send('紅色')
},
  (req, res, next) => {
    // 在剩下的2/3中的一半的請求 (所以是另一個1/3),會回傳'綠色'
    if (Math.random() < 0.5) return next()
    res.send('綠色')
  },
  function (req, res) {
    res.send('藍色')    
  },
);

app.get('*', (req, res) => res.send('Check out the "<a href="/rgb">rgb</a>" page!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/rgb\n` +
"\n...and try reloading a few times\n"));
