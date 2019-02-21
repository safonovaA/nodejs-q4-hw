import express from 'express';
import path from 'path';

import { parseCookie } from './middlewares/parse-cookies';
import { parseQuery } from './middlewares/parse-query';
import router from './routes/routes';
import DB from './database/db';
import { getDBPort } from './helpers/get-port';

const app = express();
const port = process.env.PORT || 8080;
let db;
let dbPort;

app.use(parseCookie);
app.use(parseQuery);
app.use('/api', router);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})

getDBPort()
  .then((data) => {
    dbPort = data.split(':')[1];
    console.log(`Database on port: ${dbPort}`);
    db = new DB(dbPort);
    db.connect().then(() => {
      db.importProducts(path.resolve(__dirname, 'data/products.csv'));
    })
  })
  .catch((err) => {
    console.log('Start database in docker container');
    process.exit();
  });
