const http = require('http');
const Transform = require('stream').Transform;

const port = 3000;
const server = http.createServer();

const transformRequest = (req) => new Transform({
  transform(chunk, encoding, callback) {
    const { 
      method,
      url,
      httpVersion,
    } = req;
    this.push(JSON.stringify({
      requestLine: `${method} ${url} HTTP/${httpVersion}`,
      headers: req.headers,
      messageBody: chunk.toString(),
    }));
    callback();
  }
});
 
server.on('request', (req, res) => {
  req.pipe(transformRequest(req)).pipe(res);
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`echo-server is listening on ${port}`)
});