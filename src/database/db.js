import fs from 'fs';
import { promisify } from 'util';

const csvjson = require('csvjson');

const readFile = promisify(fs.readFile);
const Sequelize = require('sequelize');
const product = require('./models/product');
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
    this.product = product(this.sequelize, Sequelize);
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
    const existedData = await this.product.findAndCountAll();
    if (!existedData.count) {
      const data = await readFile(`${path}`);
      const convertedData = csvjson
        .toObject(data.toString())
        .map(item => ({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      await this.sequelize.getQueryInterface().bulkInsert('Products', convertedData);
    }
    return await this.sequelize.close();
  }
}
