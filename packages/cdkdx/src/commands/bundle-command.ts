import path from 'path';
import fs from 'fs-extra';
import { Command } from 'clipanion';
import webpack, { Configuration } from 'webpack';

import { BaseCommand } from './base-command';

export class BundleCommand extends BaseCommand {
  @Command.Path(`bundle`)
  async execute() {
    const lambdaPath = path.join(this.context.cwd, 'src', 'lambdas');

    const entries:Record<string, string> = {};

    if (fs.existsSync(lambdaPath)) {
      fs.readdirSync(lambdaPath).forEach(name => {
        const entry = path.join(lambdaPath, name, 'index.ts'); 
        if (fs.existsSync(entry)) {
          entries[name] = entry;
        }
      });
    }

    const configs: Configuration[] = Object.keys(entries).map(key => {
      return {
        mode: 'production',
        target: 'node',
        entry: entries[key], 
        output: {
          libraryTarget: 'commonjs2',
          path: path.join(this.context.cwd, 'lambdas', key),
          filename: 'index.js'
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
      };
    });

    webpack(configs, (_err: any, _stats) => {
      //console.log(err, stats);
    });
  }
}
