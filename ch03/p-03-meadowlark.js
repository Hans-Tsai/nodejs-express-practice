const express = require('express');
const expressHandleBars = require('express-handlebars');

const app = express();

// 設定HandleBars view 引擎
app.engine('handlebars', expressHandleBars({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.render('home'));

const fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
]

app.get('/about', (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
  res.render('about', { fortune: randomFortune });
});

// 自訂當回傳404錯誤時的頁面(這個作法省略res.type()了!)
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