import mongoose from 'mongoose';
const citySchema = new mongoose.Schema({
  name: String,
  country: String,
  capital: Boolean,
  location: {
    lat: Number,
    long: Number,
  },
})
const City = new mongoose.model('City', citySchema);
export default City;