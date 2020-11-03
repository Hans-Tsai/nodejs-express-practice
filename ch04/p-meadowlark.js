// 將ch03做的幸運餅乾功能模組化
const express = require('express');
const expressHandleBars = require('express-handlebars');

const fortune = require('./lib/fortune.js');

const app = express();

// 設定HandleBars view 引擎
app.engine('handlebars', expressHandleBars({
  defaultLayout: 'main',
}))

app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
})

//  自訂當回傳404錯誤時的頁面(這個作法省略res.type()了!)
app.use((req, res) => {
  res.status(404);
  res.render('404');
})

// 自訂當回傳500錯誤時的頁面(這個作法省略res.type()了!)
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500);
    res.render('500');
})

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`))