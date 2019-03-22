import City from '../../database/mongo/models/city';

const CitiesMongoController = {
  getAll(req, res) {
    return City
      .find({})
      .then(cities => res.status(200).send(cities))
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    const city = req.body;
    return City
      .create(city)
      .then(city => res.status(201).send(city))
      .catch(err => res.status(400).send(err))
  },
  delete(req, res) {
    const { id } = req.params;
    return City
      .deleteOne({_id: id})
      .then(() => res.status(202).send('Deleted'))
      .catch((err) => res.status(400).send(err));
  },
  update(req, res) {
    const { id } = req.params;

    return City
      .findOneAndUpdate({
        _id: id
      }, req.body, {upsert: true})
      .then((city) => res.status(200).send('Updated'))
      .catch((err) => res.status(400).send(err));
  },
};

export default CitiesMongoController;
