import { Router } from 'express';
import verifyJWT from '../middlewares/verify-jwt-token';
import config from '../config/config';
import ProductsMongoController from '../controllers/mongo/products';
import ReviewsMongoController from '../controllers/mongo/reviews';
const productsPostgresController = require('../controllers').products;
const reviewsPostgresController = require('../controllers').reviews;
const products = Router();

let productsController;
let reviewsController;
// products.use(verifyJWT);
if (config.dbType === 'mongo') {
  productsController = ProductsMongoController;
  reviewsController = ReviewsMongoController;
} else {
  productsController = productsPostgresController;
  reviewsController = reviewsPostgresController;
}
products.get('/', productsController.getAll);

products.get('/:id', productsController.getById);

products.get('/:id/reviews', reviewsController.getAllReviewsForProduct);

products.post('/:id/reviews', reviewsController.create);

products.post('/', productsController.create);

export default products;
