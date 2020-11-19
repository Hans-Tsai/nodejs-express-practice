const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

// 以下的設定是為了可以使用views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// 為了圖片(images)和其他靜態檔案(static files)所做的設定
app.use(express.static(__dirname + '/public'));

const staff = {
  mitch: { name: "Mitch",
    bio: 'Mitch is the man to have at your back in a bar fight.' },
  madeline: { name: "Madeline", bio: 'Madeline is our Oregon expert.' },
  walt: { name: "Walt", bio: 'Walt is our Oregon Coast expert.' },
};

app.get('/staff/:name', (req, res, next) => {
  const info = staff[req.params.name]
  if (!info) return next()    // will eventually fall through to 404
  res.render('05-staff', info)
});

app.get('/staff', (req, res) => {
  res.render('05-staff', { staffUrls: Object.keys(staff).map(key => '/staff' + key) })
});

app.get('*', (req, res) => res.send('Check out the "<a href="/staff">staff directory</a>".'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/staff`));