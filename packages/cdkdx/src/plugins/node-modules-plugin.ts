import { builtinModules } from 'module';
import * as path from 'path';
import * as fs from 'fs-extra';
import webpack from 'webpack';
import { PackageJson } from 'type-fest';

import { PackageManager } from '../package-manager';

export interface NodeModulesPluginOptions {
  nodeModules: string[];
}

export class NodeModulesPlugin {
  public static readonly NAME = 'NodeModulesPlugin';

  private nodeModules: Record<string, PackageJson> = {};

  constructor(private readonly options: NodeModulesPluginOptions) {}

  apply(compiler: webpack.Compiler): void {
    if (this.options.nodeModules.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processModule = (name: string, module: any) => {
      const portableId: string = module.portableId
        ? module.portableId
        : module.identifier();

      if (!portableId.startsWith('external')) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const moduleName = /"(.*?)"/.exec(portableId)![1];

      if (builtinModules.includes(moduleName)) return;

      // check external
      if (!this.options.nodeModules.includes(moduleName)) return;

      const context = module.issuer?.context;

      try {
        const modulePackageFile = require.resolve(
          `${moduleName}/package.json`,
          context
            ? {
                paths: [context],
              }
            : undefined,
        );

        const { version } = fs.readJSONSync(modulePackageFile) as PackageJson;

        if (!version) throw new Error('Package.json without version');

        if (!this.nodeModules[name]) {
          //init
          this.nodeModules[name] = {
            name,
            private: true,
            dependencies: {},
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.nodeModules[name]['dependencies']![moduleName] = version;
      } catch (e) {
        throw new Error(`Error while processing nodeModules: ${e.message}`);
      }
    };

    compiler.hooks.emit.tapPromise(
      NodeModulesPlugin.NAME,
      (compilation: webpack.compilation.Compilation): Promise<void> => {
        return new Promise((resolve, _reject) => {
          compilation.chunks.forEach((chunk) => {
            for (const module of chunk.modulesIterable) {
              processModule(chunk.name, module);
            }
          });

          Object.keys(this.nodeModules).forEach((key) => {
            const json = JSON.stringify(this.nodeModules[key]);

            compilation.assets[`${key}/package.json`] = {
              source: function () {
                return json;
              },
              size: function () {
                return json.length;
              },
            };
          });

          resolve();
        });
      },
    );

    compiler.hooks.afterEmit.tapPromise(NodeModulesPlugin.NAME, () => {
      const packageManager = new PackageManager();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const outputPath = compiler.options.output!.path as string;

      return new Promise((resolve, reject) => {
        Promise.all(
          Object.keys(this.nodeModules).map((key) =>
            packageManager.install({
              cwd: path.join(outputPath, key),
              noLockfile: true,
            }),
          ),
        )
          .then(() => resolve())
          .catch((e) => reject(e));
      });
    });
  }
}
