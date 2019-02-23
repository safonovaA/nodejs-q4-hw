import { Router } from 'express';
import bodyParser from 'body-parser';

const usersController = require('../controllers').users;
const authJWT = Router();

authJWT.use(bodyParser.json());
authJWT.post('/', usersController.authWithJWT);

export default authJWT;
