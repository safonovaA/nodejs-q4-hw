const fs = require('fs');
const meow = require('meow');
const through = require('through2');
const csvjson = require('csvjson');
const path = require('path');
const transformingStream = through(transformString, end);
const cvsjsonStream = through(convertFromFile, end);

const options = {
  string: [ 'action', 'file', 'help'],
  alias: { a: 'action', f: 'file', h: 'help' },
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
`);
const argv = require('minimist')(process.argv.slice(2), options);
const argumentsLength = Object.keys(help.flags).length;

// main actions
const actions = {
  reverse: (str) => applyReverse(str),
  transform: (str) => applyTransform(str),
  outputFile: (filePath) => outputFile(filePath),
  convertFromFile: (filePath) => applyConvertFromFile(filePath),
  convertToFile: (filePath) => applyConvertToFile(filePath),
}

if (!argumentsLength) {
  help.showHelp();
} else {
  const action = argv['action'] || '';
  const file = argv['file'] || '';
  const string = argv['_'] ? argv['_'].join(' ') : '';

  if (!action && !(action && file || action && string)) {
    help.showHelp();
    return;
  }

  if (isStrAction(action) && string) {
    actions[action](string);
  } else if (isFileAction(action) && file) {
    console.log(action);
    actions[action](file);
  } else {
    help.showHelp();
  }
}

function isFileAction(action) {
  return ['convertToFile', 'convertFromFile', 'outputFile'].includes(action);
}

function isStrAction(action) {
  return ['reverse', 'transform'].includes(action);
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

function outputFile(filePath) { 
  fs.createReadStream(require('path').resolve(__dirname, `../data/${filePath}`))
    .on('error', (err) => {console.log(err)})
    .pipe(process.stdout);
}

function applyConvertFromFile(filePath) {
  const regExp = /.csv$/;
  if (!regExp.test(filePath)) {
    console.log('Should be .csv');
    return;
  }

  fs.createReadStream(require('path')
    .resolve(__dirname, `../data/${filePath}`))
    .pipe(cvsjsonStream)
    .pipe(process.stdout);
}
function applyConvertToFile(filePath) {
  const csv = /.csv$/;
  const json = '.json';
  if (!csv.test(filePath)) {
    console.log('Should be .csv');
    return;
  }
  const outputFilePath = filePath.replace(csv, json);
  fs.createReadStream(path.resolve(__dirname, `../data/${filePath}`))
    .pipe(cvsjsonStream)
    .pipe(fs.createWriteStream(path.resolve(__dirname, `../data/${outputFilePath}`)));
}

function reverse(str) { 
  return str.split('').reverse().join('');
}

function transform(str) {
  return str.toUpperCase();
}

function convertFromFile(buffer, encoding, end) { 
  this.push(JSON.stringify(csvjson.toObject(buffer.toString())))
  end();
}
function transformString(buffer, encoding, end) {
  this.push(transform(buffer.toString()));
  end();
}
function end() {
  process.exit();
}