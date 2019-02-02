const http = require('http');

const port = 3000;
const server = http.createServer();
const product = {
  id: 1,
  name: 'Supreme T-Shirt',
  brand: 'Supreme',
  price: 99.99,
  options: [{ color: 'blue' }, { size: 'XL' }]
};
server.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(product));
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`json-server is listening on ${port}`)
});