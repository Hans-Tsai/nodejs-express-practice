const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// provide a home page
app.get('/', (req, res) => res.render('06-home'));

const autoViews = {};
const fs = require('fs');
const { promisify } = require('util');
const fileExists = promisify(fs.exists);

app.use(async (req, res, next) => {
  const path = req.path.toLowerCase()
  // 檢查快取,如果它在哪裡,算繪view
  if(autoViews[path]) return res.render(autoViews[path])
  // 如果它沒有在快取,看看有沒有一個相符的(.handlebars)的檔案
  if(await fileExists(__dirname + '/views' + path + '.handlebars')) {
    autoViews[path] = path.replace(/^\//, '')
    return res.render(autoViews[path])
  }
  // 找到view,交給404處理式
  next()
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log( `\nnavigate to http://localhost:${port}/05-staff`));
