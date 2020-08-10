import { Project } from './project';
import { FileBase } from './file-base';

export class GitIgnore extends FileBase {
  private readonly excludes = new Array<string>();
  private readonly includes = new Array<string>();

  constructor(project: Project) {
    super(project, '.gitignore');
  }

  public exclude(...patterns: string[]): void {
    this.excludes.push(...patterns);
  }

  public include(...patterns: string[]): void {
    this.includes.push(...patterns);
  }

  protected get data(): string {
    return [...this.excludes, ...this.includes.map((inc) => `!${inc}`)].join(
      '\n',
    );
  }
}
