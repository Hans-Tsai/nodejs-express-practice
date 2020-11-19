const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

// 以下的設定是為了可以使用views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// 為了圖片(images)和其他靜態檔案(static files)所做的設定
app.use(express.static(__dirname + '/public'));

async function getSpecialsFromDatabase() {
  return {
    name: 'Deluxe Technicolor Widget',
    price: '$29.95',
  }
};

async function specials(req, res, next) {
  res.locals.special = await getSpecialsFromDatabase()
  next()
};

app.get('/page-with-specials', specials, (req, res) => res.render('page-with-specials'));

app.get('*', (req, res) => res.send('Check out the "<a href="/page-with-specials">specials</a>" page!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/page-with-specials`));