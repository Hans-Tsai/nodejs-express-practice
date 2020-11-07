const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

// the following is needed to use views
app.engine('handlerbars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// 使用layout檔 views/custom.handlebars
app.get('/custom-layout', (req, res) => {
  res.render('custom-layout', { layout: 'custom' })
});

app.get('*', (req, res) => res.send('Check out the "<a href="/no-layout">no layout</a>" page!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/no-layout\n`));
