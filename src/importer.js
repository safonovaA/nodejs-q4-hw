import { promisify } from 'util';
import fs from 'fs';
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
                  const buf = Buffer.from(data);
                  resolve(csvjson.toObject(buf.toString()))
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
      const buf = Buffer.from(data);
      return csvjson.toObject(buf.toString());
    })
  }
}