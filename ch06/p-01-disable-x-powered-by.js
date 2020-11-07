const express = require('express');
const app = express();

// 至少停用 X-Powered-By 標頭  => 可參考官方文件 <https://expressjs.com/zh-tw/advanced/best-practice-security.html>
// 如果您不想使用 Helmet，最起碼請停用 X-Powered-By /標頭。攻擊者可能使用這個標頭（依預設，會啟用），來偵測執行 Express 的應用程式，然後啟動特定目標的攻擊。
// 因此最佳作法是使用 app.disable() 方法來關閉標頭
// 如果您使用 helmet.js，自會為您處理此事。   
app.disable('x-powered-by');

app.get('*', (req, res) => {
  res.send(`Open your dev tools and examine your headers; ` +
  `you'll notice there is no x-powered-by header!`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`));