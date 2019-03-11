import { Router } from 'express';
import bodyParser from 'body-parser';

import config from '../config/config';

import UsersMongoController from '../controllers/mongo/users';
const usersPostgresController = require('../controllers').users;

const authJWT = Router();

let usersController;
if (config.dbType === 'mongo') {
  usersController = UsersMongoController;
} else {
  usersController = usersPostgresController;
}
authJWT.use(bodyParser.json());
authJWT.post('/', usersController.authWithJWT);

export default authJWT;
