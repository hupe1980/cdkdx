import path from 'path';
import { Command } from 'clipanion';

import { TsConfig } from '../ts-config';
import { BaseProjectCommand } from '../base-command';
import { Bundler, Lambdas } from '../bundler';
import { CdkdxConfig } from '../cdkdx-config';

export class BundleCommand extends BaseProjectCommand {
  @Command.Boolean('--watch')
  @Command.Boolean('-w')
  public watch = false;

  @Command.Boolean('--minify')
  public minify = false;

  @Command.Path('bundle')
  async execute(): Promise<number> {
    const lambdas = new Lambdas(this.projectInfo.lambdasSrcPath);

    lambdas.warnings.forEach((warning) => {
      this.context.logger.warn(`File ${warning} not found!\n`);
    });

    // Return 0 if no lambdas were found
    if (!lambdas.hasEntries()) {
      this.context.logger.log(``);
      this.context.logger.info('No lambdas were found to bundle.\n');
      return 0;
    }

    const cdkdxConfig = new CdkdxConfig(this.projectInfo);

    const tsConfig = TsConfig.fromLambdaTemplate(
      cdkdxConfig.lambdaTsConfig({
        include: ['**/*.ts'],
        exclude: ['**/__tests__/*'],
      }),
    );

    const tsConfigFile = path.join(
      this.projectInfo.lambdasSrcPath,
      'tsconfig.json',
    );

    await tsConfig.writeJson(tsConfigFile, {
      overwriteExisting: true,
    });

    const bundler = new Bundler({
      projectInfo: this.projectInfo,
      lambdas,
      minify: this.minify,
      tsConfigFile,
    });

    this.watch ? bundler.watch() : await bundler.run();

    return 0;
  }
}
