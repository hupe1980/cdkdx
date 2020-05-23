import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import Bundler from 'parcel-bundler';

import { BaseCommand } from './base-command';

export class BundleCommand extends BaseCommand {
  @Command.Path(`bundle`)
  async execute() {
    const lambdaPath = path.join(this.context.cwd, 'src', 'lambdas');

    const entryFiles = new Array<string>();

    if (fs.existsSync(lambdaPath)) {
      fs.readdirSync(lambdaPath).forEach(name => {
        const entry = path.join(lambdaPath, name, 'index.ts'); 
        if (fs.existsSync(entry)) {
          entryFiles.push(entry);
        }
      });
    }

    const options: Bundler.ParcelOptions = {
      outDir: path.join(this.context.cwd, 'lambdas'), // The out directory to put the build files in, defaults to dist
      outFile: 'index.js', // The name of the outputFile
      target: 'node',
      watch: false,
      detailedReport: false,
    };

    const bundler = new Bundler(entryFiles, options);

    await bundler.bundle();
  }
}
