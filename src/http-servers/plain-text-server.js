const http = require('http');

const port = 3000;
const server = http.createServer();

server.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/plain'
  });
  res.end('Hello word');
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`plain-text-server is listening on ${port}`)
});