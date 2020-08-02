import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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

    if (Object.keys(entries).length === 0) return 0;

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
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              transpileOnly: true,
              compilerOptions: {
                inlineSourceMap: false,
                sourceMap: true,
                composite: false,
                importsNotUsedAsValues: 'preserve',
                noEmit: false,
                declaration: false,
              },
            },
          },
          {
            test: /\.html$/i,
            loader: 'html-loader',
            options: {
              minimize: true,
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
          eslint: {
            files: ['*/**/*.ts'],
            options: {
              baseConfig: {
                extends: 'cdk',
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

    await this.webpackCompiler(config);

    return 0;
  }

  private async webpackCompiler(config: webpack.Configuration): Promise<void> {
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) {
          return reject(err);
        }

        //const info = stats.toJson();

        if (stats.hasErrors()) {
          return reject(
            'Bundling could not be performed due to the reasons mentioned above',
          );
        }

        resolve();
      });
    });
  }
}
