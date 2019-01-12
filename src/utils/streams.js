const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const meow = require('meow');
const through = require('through2');
const csvjson = require('csvjson');

const transformingStream = through(transformString, end);
const cvsjsonStream = through(convertFile, end);

const readdir = promisify(fs.readdir);

const options = {
  string: [ 'action', 'file', 'help', 'path'],
  alias: { a: 'action', f: 'file', h: 'help', p: 'path' },
}

const help = meow(`
    Usage:
        streams.js [options]

    Options:
        -h, --help                     print usage information
        -v, --version                  show version info and exit
        -a, --action <actionName>      call provided action, --file is required for
                                       outputFile, convertFromFile, convertToFile actions                            
        -f, --file <filePath>          file ?
        -p, --path <directotyPath>     path to directory for cssBundler action
`);

const CSV = /.csv$/;
const CSS = /.css$/;
const BUNDLE_FILE = 'bundle.css';
const FILE_TO_APPEND = 'nodejs-homework3.css';

const argv = require('minimist')(process.argv.slice(2), options);
const argumentsLength = Object.keys(help.flags).length;

// main actions
const actions = {
  reverse: (str) => applyReverse(str),
  transform: (str) => applyTransform(str),
  outputFile: (filePath) => outputFile(filePath),
  convertFromFile: (filePath) => applyConvertFromFile(filePath),
  convertToFile: (filePath) => applyConvertToFile(filePath),
  cssBundler: (path) => applyCssBundler(path),
}

if (!argumentsLength) {
  help.showHelp();
} else {
  const action = argv['action'] || '';
  const file = argv['file'] || '';
  const path = argv['path'] || '';
  const string = argv['_'] ? argv['_'].join(' ') : '';

  if (!action && !(action && file || action && string || action && path)) {
    help.showHelp();
    return;
  }

  if (isStrAction(action) && string) {
    actions[action](string);
  } else if (isFileAction(action) && file) {
    actions[action](file);
  } else if (action === 'cssBundler' && path){
    actions[action](path);
  } else {
    help.showHelp();
  }
}

function applyReverse(str) {
  process.stdin.on('data', (data) => {
    process.stdout.write(data);
    process.exit();
  });
  process.stdin.emit('data', reverse(str));
}

function applyTransform(str) {
  process.stdin.pipe(transformingStream).pipe(process.stdout);
  process.stdin.emit('data', str);
  process.exit();
}

function applyConvertFromFile(filePath) {
  isCsv(filePath) ?
    fs.createReadStream(require('path').resolve(__dirname, `../data/${filePath}`))
      .pipe(cvsjsonStream)
      .pipe(process.stdout) :
    console.log('Should be .csv');
}

function applyConvertToFile(filePath) {
  isCsv(filePath) ?
    fs.createReadStream(path.resolve(__dirname, `../data/${filePath}`))
      .pipe(cvsjsonStream)
      .pipe(fs.createWriteStream(path.resolve(__dirname, `../data/${filePath.replace(CSV, '.json')}`))) :
      console.log('Should be .csv');
}

function applyCssBundler(path) {
  const fullPath = require('path').resolve(__dirname, `../${path}`);

  readdir(fullPath)
    .then((files) => {
      return Promise.all(files.map((file, i) => {
        if (i === 0) {
          fs.createWriteStream(`${fullPath}/${BUNDLE_FILE}`).write('', (err) => {
            if (err) throw err;
          });
        }
        if (isCSSToBundle(file)) { 
          fs.createReadStream(`${fullPath}/${file}`)
            .on('data', (data) => {
              fs.createWriteStream(`${fullPath}/${BUNDLE_FILE}`, { flags: 'a'})
                .write(data, (err) => {
                  if (err) throw err;
                });
            })
            .on('close', () => {
              return Promise.resolve()
            }); 
        }
      }))
    })
    .then(() => {
      fs.createReadStream(`${fullPath}/${FILE_TO_APPEND}`)
        .on('data', (data) => {
          fs.appendFile(`${fullPath}/${BUNDLE_FILE}`, data, (err) => { if (err) throw err});
        })
    })
    .catch((err) => {
      console.log(err);
    });
}

function outputFile(filePath) { 
  fs.createReadStream(require('path').resolve(__dirname, `../data/${filePath}`))
    .on('error', (err) => {console.log(err)})
    .pipe(process.stdout);
}

function reverse(str) { 
  return str.split('').reverse().join('');
}

function transform(str) {
  return str.toUpperCase();
}

function csvToJSON(buffer) {
  return JSON.stringify(csvjson.toObject(buffer.toString()))
}

function convertFile(buffer, encoding, end) { 
  this.push(csvToJSON(buffer));
  end();
}

function transformString(buffer, encoding, end) {
  this.push(transform(buffer.toString()));
  end();
}

function end() {
  process.exit();
}

function isFileAction(action) {
  return ['convertToFile', 'convertFromFile', 'outputFile'].includes(action);
}

function isStrAction(action) {
  return ['reverse', 'transform'].includes(action);
}

function isCsv(fileName) {
  return CSV.test(fileName);
}

function isCSSToBundle(fileName) {
  return CSS.test(fileName) && fileName !== FILE_TO_APPEND && fileName !== BUNDLE_FILE;
}
