import { Project } from './project';
import { FileBase } from './file-base';

export interface JsonFileOptions {
  readonly obj: Record<string, unknown>;
}

export class JsonFile extends FileBase {
  protected readonly obj: Record<string, unknown>;

  constructor(project: Project, filePath: string, options: JsonFileOptions) {
    super(project, filePath);

    this.obj = options.obj;
  }

  protected onPrepare(): void {
    Object.keys(this.obj).forEach(
      (key) => this.obj[key] === undefined && delete this.obj[key],
    );
  }

  protected get data(): string {
    return JSON.stringify(this.obj, undefined, 2);
  }
}
