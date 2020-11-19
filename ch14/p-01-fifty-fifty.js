const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

app.get('/fifty-fifty', (req, res, next) => {
  if (Math.random() < 0.5) return next()
  res.send('有一半的機率會顯示這個頁面')
});

app.get('/fifty-fifty', (req, res) => {
  res.send('有另一半的機率會顯示這個頁面')
});

app.get('*', (req, res) => res.send('Check out the "<a href="/fifty-fifty">fifty-fifty</a>" page!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/fifty-fifty\n` +
"\n...and try reloading a few times\n"));
