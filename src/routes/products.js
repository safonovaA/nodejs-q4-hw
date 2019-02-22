import { Router } from 'express';
import verifyJWT from '../middlewares/verify-jwt-token';
const productsController = require('../controllers').products;
const products = Router();

products.use(verifyJWT);

products.get('/', productsController.getAll);

products.get('/:id', productsController.getById);

products.get('/:id/reviews', (req, res) => {
  res.send(`All reviews for Product #${req.params.id}`);
});

products.post('/', productsController.create);

export default products;
