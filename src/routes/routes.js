import { Router } from 'express';

import products from './products';
import authJWT from './auth-jwt';
import auth from './auth';

import verifyJWT from '../middlewares/verify-jwt-token';

const router = Router();

router.get('/', (req, res ) => {
  res.send({cookie: req.parsedCookies, query: req.parsedQuery})
});

router.get('/users', verifyJWT, (req, res) => {
  res.send('All users');
});

router.use('/products', products);

router.use('/auth-jwt', authJWT);
router.use('/auth', auth);

export default router;
