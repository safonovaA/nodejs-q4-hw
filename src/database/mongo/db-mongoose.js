const mongoose = require('mongoose');
import path from 'path';
import cities from '../../data/cities';
import City from './models/city';
import Product from './models/product';
const url = 'mongodb://localhost:32769/test';
import fs from 'fs';
import { promisify } from 'util';

const csvjson = require('csvjson');

const readFile = promisify(fs.readFile);
export default class DBMongoose {
  async connect() {
    await mongoose.connect(url);
  }
  async init() {
    let counter;
    await this.connect();
    await this.insertCities();
    counter = {
      cities: await City.countDocuments({}),
      products: await Product.countDocuments({}),
    };
    if (counter.cities === 0) {
      await this.insertCities();
    }
    if (counter.products === 0) {
      await this.insertProducts();
    }
  }
  async insertCities() {
    await City.insertMany(cities)
      .catch(err => console.error(err));
  }
  async insertProducts() {
    const products = await this.importProducts(path.resolve(__dirname, '../../data/products.csv'));
    await Product.insertMany(products)
      .catch(err => console.error(err));
  }
  async getRandomDocument() {
    const count = await City.countDocuments({});
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await City.findOne().skip(rand);
    return randomDoc;
  }
  async importProducts(path) {
    const data = await readFile(`${path}`);
    const convertedData = csvjson
      .toObject(data.toString());
    return convertedData;
  }
}
