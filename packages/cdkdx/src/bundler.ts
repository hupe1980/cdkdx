import path from 'path';
import fs from 'fs';
import webpack, { IgnorePlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { ProjectInfo } from './project-info';

const SHARED_FOLDER = 'shared';

export class Lambdas {
  public readonly entries: Record<string, string> = {};
  public readonly warnings = new Array<string>();

  constructor(srcPath: string) {
    if (fs.existsSync(srcPath)) {
      fs.readdirSync(srcPath).forEach((name) => {
        if (name === SHARED_FOLDER) return;

        const lambdaPath = path.join(srcPath, name);

        if (!fs.statSync(lambdaPath).isDirectory()) return;

        const entry = path.join(lambdaPath, 'index.ts');

        if (fs.existsSync(entry)) {
          this.entries[name] = entry;
        } else {
          this.warnings.push(entry);
        }
      });
    }
  }

  public hasEntries(): boolean {
    return Object.keys(this.entries).length > 0;
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }
}

export interface BundlerProps {
  projectInfo: ProjectInfo;
  tsConfigFile: string;
  lambdas: Lambdas;
  minify: boolean;
}

export class Bundler {
  private readonly compiler: webpack.Compiler;

  constructor(props: BundlerProps) {
    const config: webpack.Configuration = {
      target: 'node',
      mode: 'production',
      devtool: 'source-map',
      optimization: {
        minimize: props.minify,
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
        ...props.lambdas.entries,
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            include: props.projectInfo.lambdasSrcPath,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: props.tsConfigFile,
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
            include: props.projectInfo.lambdasSrcPath,
            loader: 'html-loader',
            options: {
              minimize: props.minify,
            },
          },
        ],
      },
      plugins: [
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        new IgnorePlugin(/^\.\/locale$/, /moment$/),
        new SizePlugin({
          writeFile: true,
          publish: false,
          filename: 'lambda-file-sizes.json',
        }),
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            enabled: true,
            configFile: props.tsConfigFile,
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
        path: props.projectInfo.lambdasOutPath,
        filename: '[name]/index.js',
        libraryTarget: 'commonjs2',
      },
      externals: props.projectInfo.externals,
    };

    this.compiler = webpack(config);
  }

  public async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }

        if (stats.hasErrors()) {
          return reject('Webpack compilation error, see above');
        }

        resolve();
      });
    });
  }

  public watch(): webpack.Watching {
    return this.compiler.watch(
      {
        aggregateTimeout: 300,
        poll: undefined,
      },
      (_err, _stats) => {
        return;
      },
    );
  }
}
