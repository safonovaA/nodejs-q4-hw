import express from 'express';

import { parseCookie } from './middlewares/parse-cookies';
import { parseQuery } from './middlewares/parse-query';
import router from './routes/routes';

const app = express();

const port = process.env.PORT || 8080;

app.use(parseCookie);
app.use(parseQuery);
app.use('/api', router);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
})
