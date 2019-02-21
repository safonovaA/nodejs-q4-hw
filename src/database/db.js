import fs from 'fs';
import { promisify } from 'util';

const csvjson = require('csvjson');

const readFile = promisify(fs.readFile);
const Sequelize = require('sequelize');
const Product = require('./models/product').Product;
const config = require('./config/config').development;
const params = {
  host: config.host || 'localhost',
  port: '32777',
  dialect: config.dialect || 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

export default class DB {
  constructor(port) {
    this.sequelize = new Sequelize(config.database, config.username, null, {
      ...params,
      port,
    });
    this.product = require('./models/product')(this.sequelize, Sequelize);
  }
  connect() {
    return this.sequelize
      .authenticate()
      .then(() => {
        
        return Promise.resolve();
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }
  async importProducts(path) {
    const data = await readFile(`${path}`);
    // data.map(async (item) => {
    //   await this.product.findOrCreate({
    //     where: {},
    //     defaults: {
    //       title: item.title,
    //       description: item.description,
    //       price: +item.price,
    //       amount: +item.amount,
    //     }
    //   })
    //     .spread((product, created) => {
    //       console.log(product.get({
    //         plain: true
    //       }))
    //       console.log(created);
    //     })
    // })
  }
  // importProducts(path) {
  //   readFile(`${path}`)
  //     .then((data) => {
  //       return csvjson.toObject(data.toString())
  //     })
  //     .then(data => {
  //       data.map((item) => {
  //         console.log(item);
  //         this.product.findOrCreate({
  //           where: {},
  //           defaults: {
  //             title: item.title,
  //             description: item.description,
  //             price: +item.price,
  //             amount: +item.amount,
  //           }
  //         })
  //           .spread((product, created) => {
  //             console.log(product.get({
  //               plain: true
  //             }))
  //             console.log(created);
  //           })
  //       })
  //     })
  // }
}
