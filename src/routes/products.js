import { Router } from 'express';
import verifyJWT from '../middlewares/verify-jwt-token';

const products = Router();

products.use(verifyJWT);

products.get('/', (req, res) => {
  res.send('All products');
});

products.get('/:id', (req, res) => {
  res.send(`Product with id: ${req.params.id}`);
});

products.get('/:id/reviews', (req, res) => {
  res.send(`All reviews for Product #${req.params.id}`);
});

products.post('/', (req, res) => {
  res.send('Add new product');
});

export default products;
