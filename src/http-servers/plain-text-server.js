const http = require('http');

const server = http
  .createServer()
  .on('request', (req, res) => {
    res.writeHead(200, {
      'Content-type': 'text/plain'
    });
    res.end('Hello word');
  })
  .listen(3000);