import * as path from 'path';
import * as fs from 'fs';
import { renderSinglePageModule } from 'jsii-docgen';
import { Application } from 'typedoc';
import { ScriptTarget, ModuleKind } from 'typescript';

export interface GenerateOptions {
  projectPath: string;
  typescriptExcludes?: string[];
}

export interface Docgen {
  generate: (options: GenerateOptions) => Promise<void>;
}

export class JsiiDocgen implements Docgen {
  public async generate(options: GenerateOptions): Promise<void> {
    if (!fs.existsSync(path.join(options.projectPath, '.jsii'))) {
      throw new Error('File .jsii is missing! Please run cdkdx build first.');
    }

    await renderSinglePageModule(options.projectPath, 'API.md');
  }
}

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
