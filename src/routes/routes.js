import { Router } from 'express';

import products from './products';
import authJWT from './auth-jwt';
import auth from './auth';
import config from '../config/config';
import verifyJWT from '../middlewares/verify-jwt-token';

import UsersMongoController from '../controllers/mongo/users';
const usersPostgresController = require('../controllers').users;
const router = Router();

let usersController;
if (config.dbType === 'mongo') {
  usersController = UsersMongoController;
} else {
  usersController = usersPostgresController;
}
router.get('/', (req, res ) => {
  res.send({cookie: req.parsedCookies, query: req.parsedQuery})
});

// router.get('/users', verifyJWT, usersController.getAll);
router.get('/users', usersController.getAll);
router.post('/users', usersController.create);
router.delete('/users/:id', usersController.delete);
router.use('/products', products);

router.use('/auth-jwt', authJWT);
router.use('/auth', auth);

export default router;
