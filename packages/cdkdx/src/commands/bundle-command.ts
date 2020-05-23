import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import Bundler from 'parcel-bundler';

import { BaseCommand } from './base-command';

export class BundleCommand extends BaseCommand {
  @Command.Boolean(`--minfy`)
  public fix: boolean = false;

  @Command.Path(`bundle`)
  async execute() {
    const lambdaPath = path.join(this.context.cwd, 'src', 'lambdas');

    const entries: Record<string, string> = {};

    if (fs.existsSync(lambdaPath)) {
      fs.readdirSync(lambdaPath).forEach((name) => {
        const entry = path.join(lambdaPath, name, 'index.ts');
        if (fs.existsSync(entry)) {
          entries[name] = entry;
        }
      });
    }

    await Promise.all(
      Object.keys(entries).map(async (key) => {
        const options: Bundler.ParcelOptions = {
          outDir: path.join(this.context.cwd, 'lambdas', key), // The out directory to put the build files in, defaults to dist
          outFile: 'index.js', // The name of the outputFile
          target: 'node',
          watch: false,
          detailedReport: false,
          bundleNodeModules: true,
          logLevel: 2,
        };

        const bundler = new Bundler(entries[key], options);

        return bundler.bundle();
      })
    );
  }
}
