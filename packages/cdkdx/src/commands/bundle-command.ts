import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import Bundler from 'parcel-bundler';
import setupExternalsPlugin from 'parcel-plugin-externals';

import { ProjectCommand } from './project-command';

const SHARED_FOLDER = 'shared';

export class BundleCommand extends ProjectCommand {
  @Command.Boolean('--watch')
  @Command.Boolean('-w')
  public watch = false;

  @Command.Boolean('--minify')
  public minify = false;

  @Command.Path('bundle')
  async execute(): Promise<number> {
    const entries: Record<string, string> = {};

    if (fs.existsSync(this.projectInfo.lambdasSrcPath)) {
      fs.readdirSync(this.projectInfo.lambdasSrcPath).forEach((name) => {
        if (name === SHARED_FOLDER) return;

        const entry = path.join(
          this.projectInfo.lambdasSrcPath,
          name,
          'index.ts',
        );

        if (fs.existsSync(entry)) {
          entries[name] = entry;
        }
      });
    }

    // https://github.com/parcel-bundler/parcel/issues/2838
    for (const key of Object.keys(entries)) {
      const options: Bundler.ParcelOptions = {
        outDir: path.join(this.projectInfo.lambdasOutPath, key), // The out directory to put the build files in, defaults to dist
        outFile: 'index.js', // The name of the outputFile
        cacheDir: this.projectInfo.cachePath,
        target: 'node',
        watch: this.watch,
        detailedReport: false,
        bundleNodeModules: true,
        logLevel: 3,
        minify: this.minify,
      };

      const bundler = new Bundler(entries[key], options);

      setupExternalsPlugin(bundler);

      bundler.on('bundled', () => {
        this.context.stdout.write(`\n✅ Lambda ${key} bundled.\n\n`);
      });

      await bundler.bundle();
    }

    return 0;
  }
}
