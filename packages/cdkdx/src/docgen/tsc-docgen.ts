import * as path from 'path';
import { Application } from 'typedoc';
import { ScriptTarget, ModuleKind } from 'typescript';

import { Docgen, GenerateOptions } from './docgen';

export class TscDocgen implements Docgen {
  public async generate(options: GenerateOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const app = new Application();

      app.bootstrap({
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2018,
        entryPoint: 'index',
        disableSources: true,
        excludeNotExported: true,
        readme: 'none',
        mode: 'file',
        theme: 'markdown',
        plugin: ['typedoc-plugin-markdown'],
        exclude: options.typescriptExcludes,
      });

      if (
        app.generateDocs(
          app.expandInputFiles([path.join(options.projectPath, 'src')]),
          'docs',
        )
      ) {
        return resolve();
      }

      return reject(new Error('Docgen execution failed.'));
    });
  }
}
