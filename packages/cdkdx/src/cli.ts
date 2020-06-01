import * as path from 'path';
import * as fs from 'fs-extra';
import { Cli } from 'clipanion';

import { Context } from './context';
import { BuildCommand } from './commands/build-command';
import { TestCommand } from './commands/test-command';
import { LinterCommand } from './commands/linter-command';
import { BundleCommand } from './commands/bundle-command';
import { PackageCommand } from './commands/package-command';
import { ReleaseCommand } from './commands/release-command';
import { HelpCommand } from './commands/help-command';
import { CreateCommand } from './commands/create-command';

const cwd = process.cwd();

const { name, version } = fs.readJSONSync(path.join(__dirname, '..', 'package.json'));

const constructInfo = (cwd: string) => {
  const pkgJson = fs.readJsonSync(path.join(cwd, 'package.json'));

  return {
    cdkdxVersion: version,
    isJsii: pkgJson.jsii !== undefined,
    name: pkgJson.name,
    private: pkgJson.private,
  };
};

const cli = new Cli<Context>({
  binaryLabel: 'CDKDX',
  binaryName: name,
  binaryVersion: version,
});

cli.register(HelpCommand);
cli.register(CreateCommand);
cli.register(BuildCommand);
cli.register(TestCommand);
cli.register(LinterCommand);
cli.register(BundleCommand);
cli.register(PackageCommand);
cli.register(ReleaseCommand);

cli.runExit(process.argv.slice(2), {
  ...Cli.defaultContext,
  cwd,
  ...constructInfo(cwd),
});

