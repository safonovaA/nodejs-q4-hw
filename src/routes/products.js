import { Router } from 'express';

import config from '../config/config';

import ProductsMongoController from '../controllers/mongo/products';
import ReviewsMongoController from '../controllers/mongo/reviews';
const productsPostgresController = require('../controllers').products;
const reviewsPostgresController = require('../controllers').reviews;

import addLastModified from '../middlewares/add-last-modified';

const products = Router();

let productsController;
let reviewsController;

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

products.post('/:id/reviews', addLastModified, reviewsController.create);

products.post('/', addLastModified, productsController.create);

products.delete('/:id', productsController.delete);

export default products;
