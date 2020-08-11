import * as path from 'path';
import gzipSize from 'gzip-size';
import webpack from 'webpack';

export interface LambdaFileSizePluginOptions {
  writeFile?: boolean;
}

export class LambdaFileSizePlugin {
  public static readonly NAME = 'LambdaFileSizePlugin';

  constructor(private readonly options: LambdaFileSizePluginOptions) {}

  apply(compiler: webpack.Compiler): void {
    const hook = (
      compilation: webpack.compilation.Compilation,
    ): Promise<void> => {
      return new Promise((resolve, _reject) => {
        this.outpuzSizes(compilation.assets).then(() => resolve());
      });
    };

    compiler.hooks.afterEmit.tapPromise(LambdaFileSizePlugin.NAME, hook);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async outpuzSizes(assets: Record<string, any>): Promise<void> {
    const assetNames = Object.keys(assets).filter(
      (file) => path.extname(file) === '.js',
    );

    const sizes = await Promise.all(
      assetNames.map((name) => gzipSize(assets[name].source())),
    );

    const sizeMap: Record<string, number> = {};

    assetNames.forEach((name, index) => {
      sizeMap[name] = sizes[index];
    });

    console.log(sizeMap, this.options);
  }
}
