const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

// 自訂當回傳404錯誤時的頁面
app.use((req,res) => {
  res.type('text/plain; charset=utf-8');
  res.status(404);
  res.send('404 - 找不到頁面');
})

// 自訂當回傳500錯誤時的頁面
app.use((err, req, res, next) => {
  console.error(err.message);
  res.type('text/plain; charset=utf-8');
  res.status(500);
  res.send('500 - 伺服器端無法處理該請求');
})

app.listen(port, () => {
  console.log(`Express started on http://localhost;${port}; ` + `press Ctrl-C to terminate.`);
})