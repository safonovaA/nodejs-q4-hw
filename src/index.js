import express from 'express';
import path from 'path';

import { parseCookie } from './middlewares/parse-cookies';
import { parseQuery } from './middlewares/parse-query';
import router from './routes/routes';
import DB from './database/db';
import DBMongoose from './database/mongo/db-mongoose';
import { getDBPort } from './helpers/get-port';
import bodyParser from 'body-parser';
import config from './config/config';

const app = express();
const port = process.env.PORT || 8080;
let db;
let dbPort;

app.use(parseCookie);
app.use(parseQuery);
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})

if (config.dbType === 'postgres') {
  getDBPort()
  .then((data) => {
    dbPort = data.split(':')[1];
    process.env.POSTGRES_PORT = dbPort;
    console.log(`Database on port: ${dbPort}`);
    db = new DB();
    db.connect().then(async () => {
      await db.importProducts(path.resolve(__dirname, 'data/products.csv'));
    })
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
}

if (config.dbType === 'mongo') {
  db = new DBMongoose();
  db.init();
}
