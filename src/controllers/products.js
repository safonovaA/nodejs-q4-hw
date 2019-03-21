const Product = require('../database/models').Product;

module.exports = {
  getAll(req, res) {
    return Product
      .findAll()
      .then(products => res.status(200).send(products))
      .catch(error => res.status(400).send(error));
  },
  getById(req, res) {
    return Product
      .findByPk(req.params.id)
      .then(item => {
        item ?
        res.status(200).send(item) :
        res.status(404).send(`Product with id ${req.params.id} not found`)
      })
      .catch(error => res.status(400).send(error))
  },
  create(req, res) {
    const product = req.body;
    return Product
      .create({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then(product => res.send(product))
      .catch(err => res.send(err))
  }
};