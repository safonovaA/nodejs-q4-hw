import { Router } from 'express';

import verifyJWT from '../middlewares/verify-jwt-token';
import config from '../config/config';
import UsersMongoController from '../controllers/mongo/users';
const usersPostgresController = require('../controllers').users;

const users = Router();

let usersController;

users.use(verifyJWT);
if (config.dbType === 'mongo') {
  usersController = UsersMongoController;
} else {
  usersController = usersPostgresController;
}

users.get('/', usersController.getAll);
users.post('/', usersController.create);
users.delete('/:id', usersController.delete);

export default users;
