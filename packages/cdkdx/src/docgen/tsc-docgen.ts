import * as path from 'path';
import { Application } from 'typedoc';
import { ScriptTarget, ModuleKind } from 'typescript';

import { Docgen, DocgenProps } from './docgen';

export class TscDocgen implements Docgen {
  public async generate(props: DocgenProps): Promise<void> {
    return new Promise((resolve, reject) => {
      const app = new Application();

      app.bootstrap({
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2018,
        readme: 'none',
        //theme: path.join(__dirname, 'mytheme', 'custom-theme'),
        plugin: ['typedoc-plugin-markdown'],
        exclude: ['src/lambdas', 'src/**/__tests__'],
      });

      if (
        app.generateDocs(
          app.expandInputFiles([path.join(props.projectPath, 'src')]),
          'docs',
        )
      ) {
        return resolve();
      }

      return reject(new Error('Docgen execution failed.'));
    });
  }
}
