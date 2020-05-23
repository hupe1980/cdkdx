import * as path from 'path';
import * as fs from 'fs-extra';
import { main } from './main';

const { name, version } = fs.readJSONSync(path.join(__dirname, '..', 'package.json'));

main({ binaryName: name, binaryVersion: version });