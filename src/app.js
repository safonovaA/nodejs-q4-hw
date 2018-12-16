import { User, Product } from './models';
import config from './config/config';
import { DirWatcher } from './dirwatcher';
import path from 'path';

console.log(config.name);

const user = new User();
const product = new Product();
const dw = new DirWatcher;

dw.watch(path.resolve(__dirname, 'data'), 5000);
dw.on('changed', () => {
  console.log('changed');
})