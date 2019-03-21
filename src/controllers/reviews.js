const Review = require('../database/models').Review;

module.exports = {
  getAllReviewsForProduct(req, res) {
    return Review
      .findAll({where: { productId: req.params.id}})
      .then(products => res.status(200).send(products))
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    const review = req.body;
    return Review
      .create({
        ...review,
        productId: req.params.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then(review => res.status(201).send(review))
      .catch(err => res.status(400).send(err))
  }
};