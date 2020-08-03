import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { TsConfig } from '../ts-config';
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

        const lambdaPath = path.join(this.projectInfo.lambdasSrcPath, name);
        if (!fs.statSync(lambdaPath).isDirectory()) return;

        const entry = path.join(lambdaPath, 'index.ts');

        if (fs.existsSync(entry)) {
          entries[name] = entry;
        } else {
          this.context.stdout.write(`⚠ No ${entry} found.\n\n`);
        }
      });
    }

    // Return 0 if no lambdas were found
    if (Object.keys(entries).length === 0) return 0;

    const tsConfig = TsConfig.fromLambdaTemplate({
      exclude: ['**/__tests__/*'],
    });

    await tsConfig.writeJson(
      path.join(this.projectInfo.lambdasSrcPath, 'tsconfig.json'),
      {
        overwriteExisting: false,
      },
    );

    const config: webpack.Configuration = {
      target: 'node',
      mode: 'production',
      devtool: 'source-map',
      optimization: {
        minimize: this.minify,
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            extractComments: true,
            sourceMap: true,
          }),
        ],
      },
      entry: {
        ...entries,
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: path.join(
                  this.projectInfo.lambdasSrcPath,
                  'tsconfig.json',
                ),
                transpileOnly: true,
                compilerOptions: {
                  importsNotUsedAsValues: 'preserve',
                  noEmit: false,
                  declaration: false,
                  inlineSourceMap: false,
                  sourceMap: true,
                  composite: false,
                },
              },
            },
          },
          {
            test: /\.html$/i,
            loader: 'html-loader',
            options: {
              minimize: this.minify,
            },
          },
        ],
      },
      plugins: [
        new SizePlugin({
          writeFile: true,
          publish: false,
          filename: 'lambda-file-sizes.json',
        }),
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            enabled: true,
            configFile: path.join(
              this.projectInfo.lambdasSrcPath,
              'tsconfig.json',
            ),
            configOverwrite: {
              compilerOptions: {
                importsNotUsedAsValues: 'preserve',
                noEmit: false,
                declaration: false,
                inlineSourceMap: false,
                sourceMap: true,
                composite: false,
              },
            },
          },
        }),
        new FriendlyErrorsWebpackPlugin({
          clearConsole: false,
        }),
      ],
      output: {
        path: this.projectInfo.lambdasOutPath,
        filename: '[name]/index.js',
        libraryTarget: 'commonjs2',
      },
      externals: this.projectInfo.externals,
    };

    const compiler = webpack(config);

    this.watch ? this.watchWebpack(compiler) : await this.runWebpack(compiler);

    return 0;
  }

  private watchWebpack(compiler: webpack.Compiler): webpack.Watching {
    return compiler.watch(
      {
        aggregateTimeout: 300,
        poll: undefined,
      },
      (_err, _stats) => {
        return;
      },
    );
  }

  private async runWebpack(compiler: webpack.Compiler): Promise<void> {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }

        //const info = stats.toJson();

        if (stats.hasErrors()) {
          return reject('Webpack compilation error, see above');
        }

        resolve();
      });
    });
  }
}
