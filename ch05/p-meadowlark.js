const expressHandlebars = require('express-handlebars');
const express = require('express');

const handlers = require('./lib/handlers');

const app = express();

// 設定HandleBars view 引擎
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.home);

app.get('/about', (req, res) => handlers.about);

// 自訂當回傳404錯誤時的頁面(這個作法省略res.type()了!)
app.use(handlers.notFound);

// 自訂當回傳500錯誤時的頁面(這個作法省略res.type()了!)
app.use(handlers.serverError);

if (require === module) {
	app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app;
}



