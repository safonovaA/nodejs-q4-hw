import { promisify } from 'util';
const exec = promisify(require('child_process').exec);

const command = 'docker port postgres 5432/tcp';

export const getDBPort = async function() {
  const result = await exec(command);
  const { stdout, stderr } = result;
  if (stderr) {
    process.stdout('Start postgres in docker container');
    process.exit();
  }
  return stdout;
}
