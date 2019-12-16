import path from 'path';
import fs from 'fs-extra';
import { EventEmitter } from 'events';
import packlist from 'npm-packlist';
//import rollup from 'rollup';

import { zipFiles } from '../utils';
import { Runner } from '../runner';
import { PackageInfo } from '../package-info';

export class Bundler extends EventEmitter implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {
    super();
  }

  public async run() {
    const lambdaDependencies = this.packageInfo.getLambdaDependencies();

    if (lambdaDependencies) {
      await Promise.all(
        Object.keys(lambdaDependencies).map(
          async (lambdaPkg): Promise<void> => {
            const lambdaSrc = path.join(
              this.packageInfo.cwd,
              'node_modules',
              ...lambdaPkg.split('/')
            );
            const lambdaDest = path.join(
              this.packageInfo.cwd,
              'lambda',
              lambdaDependencies[lambdaPkg]
            );

            await this.packDirectory(lambdaSrc, lambdaDest);
          }
        )
      );
    }
  }

  // private async buildLambdas() {
  //   const bundle = await rollup.rollup(inputOptions);
  // }

  private async packDirectory(
    sourcePath: string,
    outputFile: string
  ): Promise<void> {
    const files = await packlist({ path: sourcePath });

    if (!(await fs.pathExists(outputFile))) {
      await fs.createFile(outputFile);
    }

    return zipFiles(files, sourcePath, outputFile);
  }
}
