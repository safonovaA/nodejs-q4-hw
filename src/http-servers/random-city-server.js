const http = require('http');
import DBMongoNativeDriver from '../database/mongo/db-native';

const port = 8081;
const server = http.createServer();
const db = new DBMongoNativeDriver();

server.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'application/json; charset=utf-8'
  });
  db.init()
    .then(async () => {
      const randomDocument = await db.getRandomDocument();
      res.end(JSON.stringify(randomDocument));
    })
    .catch((err) => console.error(err));
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`random-city-server is listening on ${port}`)
});