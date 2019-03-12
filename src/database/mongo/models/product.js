import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  amount: Number,
  lastModifiedAt: Date,
})
const Product = new mongoose.model('Product', productSchema);

export default Product;
