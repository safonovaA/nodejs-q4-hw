const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
import cities from '../../data/cities';

const url = 'mongodb://localhost:32768';
const dbName = 'test';

const client = new MongoClient(url);

export default class DBMongoNativeDriver {
  async connect() {
    return await client.connect();
  }
  async init() {
    let counter;
    await this.connect();
    counter = await this.countCollection();
    if (counter === 0) {
      await this.insertCities();
    }
    return Promise.resolve();
  }
  async insertCities() {
    await client.db(dbName).collection('cities').insertMany(cities)
      .catch(err => assert.equal(err));
  }
  async getRandomDocument() {
    const randomDocument = await client
      .db(dbName)
      .collection('cities')
      .aggregate([{$sample: {size: 1}}])
      .toArray();
    return randomDocument[0];
  }
  async countCollection(){
    return await client.db(dbName)
      .collection('cities')
      .count();
  }
  closeConnection() {
    client.close();
  }
}
