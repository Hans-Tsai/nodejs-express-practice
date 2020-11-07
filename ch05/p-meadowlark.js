const express = require('express');
const expressHandlebars = require('express-handlebars');

const handlers = require('./lib/handlers');

const app = express();

// 設定HandleBars view 引擎
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', handlers.home);

app.get('/about', handlers.about);

// 自訂當回傳404錯誤時的頁面(這個作法省略res.type()了!)
app.use(handlers.notFound);

// 自訂當回傳500錯誤時的頁面(這個作法省略res.type()了!)
app.use(handlers.serverError)

// 將app修改成可以require的模組,因為原本app.listen()的設計只能直接執行
if(require.main === module) {
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app 
}
