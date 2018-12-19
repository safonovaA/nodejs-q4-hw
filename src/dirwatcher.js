import EventEmmiter from 'events';
import fs from 'fs';
import { promisify } from 'util';
import crypto from 'crypto';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

export class DirWatcher extends EventEmmiter {
  constructor() {
    super();
    this.isFirstCheck = true;
    this.prevFiles = [];
    this.prevFilesList = [];
  }

  watch(path, delay) {
    this.isFirstCheck ? 
      this.firstReading(path)
        .then((files) => {
          this.prevFiles = files;
          this.isFirstCheck = false;
        }) : 
      this.compareFiles(path)
        .then((files) => {
          this.prevFiles = files;
        });
    setTimeout(() => {
      console.log('check completed, watch')
      this.watch(path, delay);
    }, delay);

  }

  firstReading(path) {
    return new Promise((resolve, reject) => {
      readdir(path)
        .then((files) => {
          this.readFiles(path, files)
            .then((files) => {
              resolve(files);
            });
        })
        .catch((err) => reject(err))
    });
  }

  readFiles(path, files) {
    this.prevFilesList = files;
    return Promise.all(files.map((file, i) => {
      return new Promise((resolve) => {
        readFile(`${path}/${file}`)
          .then((data) => {
            const hash = crypto.createHash('sha1').update(data).digest('hex');
            resolve({ file, hash })
          })
          .catch((err) => {
            console.log(err);
          })
      })
    }))
  }

  isFilesChanged(prevFiles, currentFiles) {
    return currentFiles.every((curr) => {
      const fileToCompare = prevFiles.find(item => item.file === curr.file);
      return fileToCompare && curr.hash === fileToCompare.hash;
    });
  }

  compareFiles(path) {
    let isDeleted, isAdded, isChanged;
    return new Promise((resolve, reject) => {
      readdir(path)
        .then((files) => {
          isDeleted = !this.prevFilesList.every((item) => files.includes(item));
          isAdded = !files.every((item) => this.prevFilesList.includes(item));
          this.readFiles(path, files)
            .then((files) => {
              isChanged = !this.isFilesChanged(this.prevFiles, files);
              if (isDeleted || isAdded || isChanged) {
                this.emit('changed');
              }
              resolve(files);
            })
        })
        .catch((err) => reject(err));
    });
  }
}