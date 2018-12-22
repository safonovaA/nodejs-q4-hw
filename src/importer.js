import fs from 'fs';
import { promisify } from 'util';

const csvjson = require('csvjson');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

export class Importer {
  import(path) {
    console.log('async');
    return new Promise((resolve, reject) => {
      readdir(path)
        .then((files) => {
          resolve(Promise.all(files.map((file) => {
            return new Promise((resolve) => {
              readFile(`${path}/${file}`)
                .then((data) => {
                  resolve(csvjson.toObject(data.toString()))
                })
                .catch((err) => {
                  console.log(err);
                })
            })
          })
          ))
        })
        .catch((err) => reject(err))
    })
  }

  importSync(path) {
    const files = fs.readdirSync(path);
    return files.map((file) => {
      const data = fs.readFileSync(`${path}/${file}`);
      return csvjson.toObject(data.toString());
    })
  }
}