const mongoose = require('mongoose');
import cities from '../../data/cities';

const url = 'mongodb://localhost:32768/test';
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

export default class DBMongoose {
  async connect() {
    await mongoose.connect(url);
  }
  async init() {
    let counter;
    await this.connect();
    await this.insertCities();
    counter = await City.countDocuments({});
    if (counter === 0) {
      await this.insertCities();
    }
  }
  async insertCities() {
    await City.insertMany(cities)
      .catch(err => console.error(err));
  }
  async getRandomDocument() {
    const count = await City.countDocuments({});
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await City.findOne().skip(rand);
    return randomDoc;
  }
}
