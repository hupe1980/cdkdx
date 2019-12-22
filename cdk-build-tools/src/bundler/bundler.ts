import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import { Runner } from '../runner';
import { PackageInfo, LambdaConfig } from '../package-info';
import { getWorkspaces } from '../get-workspaces';
import { getEntryForLambda } from './get-entry-for-lambda';
import { WebpackZipPlugin } from './webpack-zip-plugin';

export class Bundler implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {}

  public async run() {
    const lambdaDependencies = this.packageInfo.getLambdaDependencies();

    await getWorkspaces({ cwd: this.packageInfo.rootDir || undefined });

    if (lambdaDependencies) {
      await Promise.all(
        Object.keys(lambdaDependencies).map(
          async (key): Promise<void> => {
            const config = lambdaDependencies[key];
            await this.buildLambdas(config);
          }
        )
      );
    }
  }

  private async buildLambdas(config: LambdaConfig) {
    //const rootDir = this.packageInfo.rootDir || this.packageInfo.cwd;

    return;

    const entries = await getEntryForLambda(config.handler, {
      cwd: path.join(this.packageInfo.cwd, '..') //TODO
    });

    const compiler = webpack({
      mode: 'production',
      target: 'node',
      externals: [
        nodeExternals({
          modulesFromFile: true
        })
      ],
      entry: entries,
      output: {
        libraryTarget: 'commonjs2',
        path: path.join(this.packageInfo.cwd, '.webpack'),
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-typescript']
              }
            }
          }
        ]
      },
      plugins: [
        new WebpackZipPlugin({
          path: path.join(this.packageInfo.cwd),
          filename: config.artifact
        }),
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [
              'The bundling of lambdas was successfully completed',
              'Now start compiling the construct[s]..'
            ],
            notes: []
          }
        })
      ]
    });

    compiler.run((_err: any, _stats) => {
      //console.log(err, stats);
    });
  }
}
