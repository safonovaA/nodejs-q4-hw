const http = require('http');
import DBMongoNativeDriver from '../database/mongo/db-native';
import DBMongoose from '../database/mongo/db-mongoose';

const port = 8082;
const server = http.createServer();
const db = new DBMongoose();

server.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'application/json; charset=utf-8'
  });
  console.log('requested');
  db.init()
    .then( async () => {
      const randomDocument = await db.getRandomDocument();
      res.end(JSON.stringify(randomDocument));
    });
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`random-city-mongoose-server is listening on ${port}`)
});