import { Router } from 'express';

const router = Router();

router.get('/', (req, res ) => {
  res.send({cookie: req.parsedCookies, query: req.parsedQuery})
});

router.get('/products', (req, res) => {
  res.send('All products');
});

router.get('/products/:id', (req, res) => {
  res.send(`Product with id: ${req.params.id}`);
});

router.get('/products/:id/reviews', (req, res) => {
  res.send(`All reviews for Product #${req.params.id}`);
});

router.post('/products', (req, res) => {
  res.send('Add new product');
});

router.get('/users', (req, res) => {
  res.send('All users');
});

export default router;
