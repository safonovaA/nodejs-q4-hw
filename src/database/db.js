import fs from 'fs';
import { promisify } from 'util';

const csvjson = require('csvjson');

const readFile = promisify(fs.readFile);
import db from './models/index';

export default class DB {
  connect() {
    return db.sequelize
      .authenticate()
      .then(() => {
        return Promise.resolve();
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }
  async importProducts(path) {
    const existedData = await db.Product.findAndCountAll();
    if (!existedData.count) {
      const data = await readFile(`${path}`);
      const convertedData = csvjson
        .toObject(data.toString())
        .map(item => ({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      await db.sequelize.getQueryInterface().bulkInsert('Products', convertedData);
    }
    return Promise.resolve();
  }
}
