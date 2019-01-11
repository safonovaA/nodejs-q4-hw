const fs = require('fs');
const meow = require('meow');
const through = require('through2');
const stream = through(write, end);

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
  convertFromFile: (filePath) => convertFromFile(filePath),
  convertToFile: (filePath) => convertToFile(filePath),
}

function outputFile(filePath) { console.log(1 + 1, 'output');}
function convertFromFile(filePath) { console.log(1 + 1, 'convertFrom');}
function convertToFile(filePath) { console.log(1 + 1, 'convertTo');}

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
  process.stdin.pipe(stream).pipe(process.stdout);
  process.stdin.emit('data', str);
  process.exit();
}

function reverse(str) { 
  return str.split('').reverse().join('');
}

function transform(str) {
  return str.toUpperCase();
}

function write(buffer, encoding, end) {
  this.push(transform(buffer.toString()));
  end();
}
function end() {
  console.log('end');
  done();
}