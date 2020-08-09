import { ProjectOptions } from './project';
import { LibProject } from './lib-project';

export class JsiiLibProject extends LibProject {
  constructor(options: ProjectOptions) {
    super(options);

    this.addFields({
      jsii: {
        outdir: 'dist',
        tsc: {
          outDir: this.outDir,
          rootDir: this.srcDir,
        },
        excludeTypescript: [
          `${this.srcDir}/lambdas`,
          `${this.srcDir}/**/__tests__`,
        ],
        targets: {
          python: {
            distName: options.name,
            module: options.name.replace('-', '_'),
          },
        },
      },
    });
  }
}
