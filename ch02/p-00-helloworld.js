const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req,res) =>{
  res.writeHead(200, {'Content-type': 'text/plain'});
  res.end('Hello Hans');
})

server.listen(port, () => {console.log(`server started on port ${port}; ` +
  'press Ctrl-C to terminate....') }
  )