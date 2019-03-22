import { Router } from 'express';

import CitiesMongoController from '../controllers/mongo/cities';
import addLastModified from '../middlewares/add-last-modified';
const cities = Router();

cities.get('/', CitiesMongoController.getAll);
cities.post('/', addLastModified, CitiesMongoController.create);
cities.delete('/:id', CitiesMongoController.delete);
cities.put('/:id', addLastModified, CitiesMongoController.update);

export default cities;
