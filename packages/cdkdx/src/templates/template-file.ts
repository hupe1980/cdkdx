import { Project } from './project';
import { FileBase } from './file-base';

export interface TemplateFileOptions {
  template: string;
  context: Record<string, unknown>;
}

export class TemplateFile extends FileBase {
  private readonly template: string;
  private readonly context: Record<string, unknown>;

  public static replacePlaceholders(
    template: string,
    context: Record<string, unknown>
  ): string {
    const keys = Object.keys(context);
    const func = Function(...keys, 'return `' + template + '`;');

    return func(...keys.map((k) => context[k]));
  }

  constructor(
    project: Project,
    filePath: string,
    { context, template }: TemplateFileOptions
  ) {
    super(project, TemplateFile.replacePlaceholders(filePath, context));

    this.template = template;
    this.context = context;
  }

  protected get data(): string {
    return TemplateFile.replacePlaceholders(this.template, this.context);
  }
}
