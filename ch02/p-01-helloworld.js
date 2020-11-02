const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req,res) => {
  const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
  switch (path) {
    case '':
      res.writeHead(200, { 'Content-type': 'text/plain; charset=utf-8' });
      res.end('首頁')
      break;
    case '/about':
      res.writeHead(200, { 'Content-type': 'text/plain; charset=utf-8'} );
      res.end('關於');
    default:
      res.writeHead(404, { 'Content-type': 'text/plain; charset=utf-8'} );
      res.end('找不到頁面');
      break;
  }
})

server.listen(port, () => {
  console.log(`server started on port ${port}; ` + 'press Ctrl-C to terminate....');
})