import { User, Product } from './models';
import config from './config/config';
import { DirWatcher } from './dirwatcher';
import path from 'path';
import { Importer } from './importer';

console.log(config.name);

const user = new User();
const product = new Product();
const dw = new DirWatcher();
const importer = new Importer();

dw.watch(path.resolve(__dirname, 'data'), 3000);
dw.on('changed', () => {
  console.log('changed');
  importer.import(path.resolve(__dirname, 'data'))
    .then((data) => {
      console.log('Imported data via import:', data);
    });

  const files = importer.importSync(path.resolve(__dirname, 'data'));
  console.log('Imported data via importSync:', files);
})
