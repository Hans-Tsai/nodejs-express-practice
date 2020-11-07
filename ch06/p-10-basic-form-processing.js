const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

// the following is needed to use views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/thank-you', (req, res) => {
  res.render('10-thank-you');
});

app.get('*', (req, res) => {
  res.render('10-home');
});

app.post('/process-contact', (req, res) => {
  console.log(`已收到來自${req.body.name} <${req.body.email}>`);
  res.redirect(303, 'thank-you');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`));