import { Router } from 'express';

import config from '../config/config';

import UsersMongoController from '../controllers/mongo/users';
const usersPostgresController = require('../controllers').users;

import addLastModified from '../middlewares/add-last-modified';

const users = Router();

let usersController;

if (config.dbType === 'mongo') {
  usersController = UsersMongoController;
} else {
  usersController = usersPostgresController;
}

users.get('/', usersController.getAll);
users.post('/', addLastModified, usersController.create);
users.delete('/:id', usersController.delete);

export default users;
