import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  content: String,
  score: String,
})
const Review = new mongoose.model('Review', reviewSchema);

export default Review;
