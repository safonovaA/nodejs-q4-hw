import Product from '../../database/mongo/models/product';

const ProductsMongoController = {
  getAll(req, res) {
    return Product
      .find({})
      .then(products => res.status(200).send(products))
      .catch(error => res.status(400).send(error));
  },
  getById(req, res) {
    const { id } = req.params;
    return Product
      .findById(id)
      .then(item => {
        item ?
          res.status(200).send(item) :
          res.status(404).send(`Product with id ${req.params.id} not found`)
      })
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    const product = req.body;
    return Product
      .create(product)
      .then(product => res.status(201).send(product))
      .catch(err => res.status(400).send(err))
  },
  delete(req, res) {
    const { id } = req.params;
    return Product
      .deleteOne({_id: id})
      .then(() => res.status(202).send('Deleted'))
      .catch((err) => res.status(400).send(err));
  },
};
export default ProductsMongoController;
