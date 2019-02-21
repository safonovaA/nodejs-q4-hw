import { Router } from 'express';

import products from './products';

const router = Router();

router.get('/', (req, res ) => {
  res.send({cookie: req.parsedCookies, query: req.parsedQuery})
});

router.get('/users', (req, res) => {
  res.send('All users');
});

router.use('/products', products);

export default router;
