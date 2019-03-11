import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const mongoose = require('mongoose');
const csvjson = require('csvjson');

import cities from '../../data/cities';
import users from '../../data/users';

import City from './models/city';
import Product from './models/product';
import User from './models/user';

const url = 'mongodb://localhost:32769/test';



const readFile = promisify(fs.readFile);
export default class DBMongoose {
  async connect() {
    await mongoose.connect(url);
  }
  async init() {
    let counter;
    await this.connect();

    counter = {
      cities: await City.countDocuments({}),
      products: await Product.countDocuments({}),
      users: await User.countDocuments({}),
    };

    if (counter.cities === 0) {
      await this.insertCities();
    }
    if (counter.products === 0) {
      await this.insertProducts();
    }
    if (counter.users === 0) {
      await this.insertUsers();
    }
  }
  async insertCities() {
    await City.insertMany(cities)
      .catch(err => console.error(err));
  }
  async insertProducts() {
    const products = await this.importFromCsv(path.resolve(__dirname, '../../data/products.csv'));
    await Product.insertMany(products)
      .catch(err => console.error(err));
  }
  async insertUsers() {
    await User.insertMany(users)
      .catch(err => console.error(err));
  }
  async getRandomDocument() {
    const count = await City.countDocuments({});
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await City.findOne().skip(rand);
    return randomDoc;
  }
  async importFromCsv(path) {
    const data = await readFile(`${path}`);
    const convertedData = csvjson
      .toObject(data.toString());
    return convertedData;
  }
}
