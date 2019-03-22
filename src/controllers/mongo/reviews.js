import Review from '../../database/mongo/models/review';

const ReviewsMongoController = {
  getAllReviewsForProduct(req, res) {
    return Review
      .find({ productId: req.params.id})
      .then(products => res.status(200).send(products))
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    const review = req.body;
    return Review
      .create({
        ...review,
        productId: req.params.id,
      })
      .then(review => res.status(201).send(review))
      .catch(err => res.status(400).send(err))
  }
};

export default ReviewsMongoController;
