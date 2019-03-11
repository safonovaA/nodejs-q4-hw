import { Router } from 'express';

import CitiesMongoController from '../controllers/mongo/cities';

const cities = Router();

cities.get('/', CitiesMongoController.getAll);
cities.post('/', CitiesMongoController.create);
cities.delete('/:id', CitiesMongoController.delete);
cities.put('/:id', CitiesMongoController.update);

export default cities;
