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
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// 為了圖片(images)和其他靜態檔案(static files)所做的設定
app.use(express.static(__dirname + '/public'));