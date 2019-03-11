import { Router } from 'express';

import products from './products';
import authJWT from './auth-jwt';
import auth from './auth';
import users from './users';
import cities from './cities';
import verifyJWT from '../middlewares/verify-jwt-token';
import config from '../config/config';

const router = Router();

router.get('/', (req, res ) => {
  res.send({cookie: req.parsedCookies, query: req.parsedQuery})
});

router.use('/users', verifyJWT, users);
router.use('/products', verifyJWT, products);
router.use('/cities', cities);

router.use('/auth-jwt', authJWT);
router.use('/auth', auth);

export default router;
