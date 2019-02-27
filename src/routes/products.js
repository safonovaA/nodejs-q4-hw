import { Router } from 'express';
import verifyJWT from '../middlewares/verify-jwt-token';
const productsController = require('../controllers').products;
const reviewsController = require('../controllers').reviews;
const products = Router();

products.use(verifyJWT);

products.get('/', productsController.getAll);

products.get('/:id', productsController.getById);

products.get('/:id/reviews', reviewsController.getAllReviewsForProduct);

products.post('/:id/reviews', reviewsController.create);

products.post('/', productsController.create);

export default products;
