const http = require('http');
const url = require('url');
const queryString = require('querystring');

const Transform = require('stream').Transform

const fs = require('fs');
const path = require('path');

const port = 3000;
const server = http.createServer();

const transformMessage = (message) => new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().replace(/{message}/, message));
    callback();
  }
});

server.on('request', (req, res) => {
  const query = url.parse(req.url).query;
  const params = queryString.parse(query);
  const message = params.message || 'Hello world!';

  res.writeHead(200, {
    'Content-type': 'text/html; charset=utf-8'
  });

  fs.createReadStream(path.resolve(__dirname, 'index.html'))
  .pipe(transformMessage(message))
  .pipe(res);
  // res.write('<head><meta charset="utf-8"></head><body><h1>​{message}​</h1></body>'.replace(/{message}/, message));
  // res.end();
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`html-server is listening on ${port}`)
});
