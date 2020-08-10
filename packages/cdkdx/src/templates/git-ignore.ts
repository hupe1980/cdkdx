import { Project } from './project';
import { FileBase } from './file-base';

export class GitIgnore extends FileBase {
  private readonly excludes = new Array<string>();
  private readonly includes = new Array<string>();

  constructor(project: Project) {
    super(project, '.gitignore');
  }

  public excludesFromString(gitignore: string): void {
    gitignore.split('\n').forEach((line) => this.exclude(line));
  }

  public exclude(...patterns: string[]): void {
    this.excludes.push(...patterns);
  }

  public include(...patterns: string[]): void {
    this.includes.push(...patterns.map((inc) => `!${inc}`));
  }

  protected get data(): string {
    return [...this.excludes, ...this.includes].join('\n');
  }
}
