const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`正在處理${req.url}的請求`)
  next()
});

app.use((req, res, next) => {
  console.log(`已終止該請求`)
  res.send('感謝體驗這次的簡易中介函式功能練習')
});

app.use((req, res, next) => {
  console.log('這個中介函式不應該被執行到,因為上一個中介函式的結尾並沒有呼叫next()')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
  '; press Ctrl-C to terminate.')
});