import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import Bundler from 'parcel-bundler';
import setupExternalsPlugin from 'parcel-plugin-externals';

import { ConstructCommand } from './construct-command';

const SHARED_FOLDER = 'shared';

export class BundleCommand extends ConstructCommand {
  @Command.Boolean('--minify')
  public minify = false;

  @Command.Path('bundle')
  async execute(): Promise<number> {
    const lambdaPath = path.join(this.context.cwd, 'src', 'lambdas');

    const entries: Record<string, string> = {};

    if (fs.existsSync(lambdaPath)) {
      fs.readdirSync(lambdaPath).forEach((name) => {
        if (name === SHARED_FOLDER) return;

        const entry = path.join(lambdaPath, name, 'index.ts');

        if (fs.existsSync(entry)) {
          entries[name] = entry;
        }
      });
    }

    await Promise.all(
      Object.keys(entries).map(async (key) => {
        const options: Bundler.ParcelOptions = {
          outDir: path.join(this.context.cwd, 'lib', 'lambdas', key), // The out directory to put the build files in, defaults to dist
          outFile: 'index.js', // The name of the outputFile
          cacheDir: path.join(this.context.cwd, '.cdkdx'),
          target: 'node',
          watch: false,
          detailedReport: false,
          bundleNodeModules: true,
          logLevel: 3,
          minify: this.minify,
        };

        const bundler = new Bundler(entries[key], options);

        setupExternalsPlugin(bundler);

        // https://github.com/parcel-bundler/parcel/issues/2838
        return new Promise((resolve) => {
          bundler.on('bundled', () => {
            this.context.stdout.write(`\n✅ Lambda ${key} bundled.\n\n`);
            resolve();
          });

          bundler.bundle();
        }); 
      })
    );

    return 0;
  }
}
