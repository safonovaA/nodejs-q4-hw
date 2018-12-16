import EventEmmiter from 'events';
import fs from 'fs';
import { Buffer } from 'buffer';
import { promisify } from 'util';

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
    if (this.isFirstCheck) {
      this.firstReading(path)
        .then((files) => this.prevFiles = files);
      setTimeout(() => {
        this.watch(path, delay);
      }, delay);
    } else {
      this.compareFiles(path)
        .then((files) => this.prevFiles = files);
      setTimeout(() => {
        console.log('check completed, start watch')
        this.watch(path, delay);
      }, delay);
    }
  }

  firstReading(path) {
    this.isFirstCheck = false;

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
            resolve({ file, data })
          })
          .catch((err) => {
            console.log(err);
          })
      })
    }))
  }

  isFilesChanged(prevFiles, currentFiles) {
    return currentFiles.reduce((acc, curr) => {
      const fileToCompare = prevFiles.find(item => item.file === curr.file);
      return acc && fileToCompare && Buffer.from(curr.data).equals(Buffer.from(fileToCompare.data));
    }, true);
  }

  compareFiles(path) {
    let isDeleted, isAdded, isChanged;

    return new Promise((resolve, reject) => {
      readdir(path)
        .then((files) => {
          isDeleted = this.prevFilesList.reduce((acc, curr) => (!files.includes(curr)), false);
          isAdded = files.reduce((acc, curr) => (!this.prevFilesList.includes(curr)), false);
          this.readFiles(path, files)
            .then((files) => {
              isChanged = !this.isFilesChanged(this.prevFiles, files);
              if (isDeleted || isAdded || isChanged) {
                this.emit('changed');
              }
              resolve(files);
            })
        })
        .catch((err) => reject(err))
    });
  }
}