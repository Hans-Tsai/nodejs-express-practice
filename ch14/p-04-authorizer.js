const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

// 以下的中介函式是為了用sessions來模擬登入,所做的必要設定
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cookieSecret = Math.random().toString();
app.use(cookieParser(cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: cookieSecret,
}));

// 以下的設定是為了可以使用views
app.engine('handlebars', expressHandlebars({ defaultLayout: '04-main' }));
app.set('view engine', 'handlebars');

// 為了圖片(images)和其他靜態檔案(static files)所做的設定
app.use(express.static(__dirname + '/public'));

// 這是假的登錄功能,並不會真的檢查使用者名稱和密碼
app.post('/login', (req, res) => {
  req.session.user = { email: req.body.email }
  req.session.authorized = true
  res.redirect('/secret')
});

// 假的登出功能
app.get('/logout', (req, res) => {
  delete req.session.user
  delete req.session.authorized
  res.redirect('/public')
});

// make the user object available to all views by putting it in the "locals" context
app.use((req, res, next) => {
  if(req.session) res.locals.user = req.session.user
  next()
});

// 可以製作一個授權機制, 假設我們的用戶授權碼設定一個稱為req.session.authorized的session變數
// 我們可以利用以下的函式來製作可重複使用的授權過濾器
function authorize(req, res, next) {
  if(req.session.authorized) return next()
  res.render('not-authorized')
};

app.get('/public', (req, res) => res.render('public'));

app.get('/secret', authorize, (req, res) => res.render('secret'));

app.get('*', (req, res) => res.send('Check out the <a href="/public">public content</a>.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/public`));
