import * as path from 'path';
import * as fs from 'fs-extra';
import { Cli } from 'clipanion';

import { Context } from './context';
import {
  BuildCommand,
  TestCommand,
  LinterCommand,
  NodeCommand,
  BundleCommand,
  PackageCommand,
  ReleaseCommand,
  HelpCommand,
  CreateCommand,
} from './commands';

const cwd = process.cwd();

const { name, version } = fs.readJSONSync(path.join(__dirname, '..', 'package.json'));

const cli = new Cli<Context>({
  binaryLabel: name,
  binaryName: name,
  binaryVersion: version,
});

cli.register(HelpCommand);
cli.register(CreateCommand);
cli.register(BuildCommand);
cli.register(TestCommand);
cli.register(LinterCommand);
cli.register(NodeCommand);
cli.register(BundleCommand);
cli.register(PackageCommand);
cli.register(ReleaseCommand);

cli.runExit(process.argv.slice(2), {
  ...Cli.defaultContext,
  cwd,
  version,
});

