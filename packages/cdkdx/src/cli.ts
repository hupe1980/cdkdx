import { main } from './main';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../package.json');

main({ binaryName: name, binaryVersion: version });