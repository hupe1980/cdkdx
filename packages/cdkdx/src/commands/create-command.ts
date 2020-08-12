import chalk from 'chalk';
import { Command } from 'clipanion';

import { BaseCommand } from '../base-command';
import { Template } from '../template';
import { Timer } from '../timer';
import { GitRepository } from '../git-repository';

export class CreateCommand extends BaseCommand {
  static usage = Command.Usage({
    description: 'Create a new, empty CDK project from a template',
    details: `
            This command will create a new, empty CDK project from a template.
        `,
    examples: [
      ['Create a cdk app', 'npx cdkdx create app my-app'],
      ['Create a cdk lib', 'npx cdkdx create lib my-lib'],
      ['Create a jsii cdk lib', 'npx cdkdx create jsii-lib my-lib'],
    ],
  });

  @Command.String({ required: true })
  public type!: 'lib' | 'jsii-lib' | 'app';

  @Command.String({ required: true })
  public name!: string;

  @Command.Path('create')
  async execute(): Promise<number> {
    const timer = new Timer();

    const template = await Template.newInstance({
      cwd: this.context.cwd,
      version: this.context.version,
      type: this.type,
      name: this.name,
    });

    template.createProject();

    this.context.logger.log(``);

    this.context.logger.info(
      `Installing dependencies:\n${template
        .getDependencyNames()
        .map((dep) => chalk.bold.cyan(dep))
        .join('\n')}\n`,
    );

    await template.installDependencies();

    this.context.logger.log(``);

    this.context.logger.done(`Dependencies installed.\n`);

    try {
      const gitRepository = new GitRepository(template.getTargetPath());

      if (!(await gitRepository.isInGitRepository())) {
        this.context.logger.info('Initializing a new git repository.\n');

        await gitRepository.initializeGitRepository();

        this.context.logger.done(`Git repository initialized.\n`);
      }
    } catch (e) {
      this.context.logger.warn(
        'Unable to initialize git repository for your project.\n',
      );
    }

    timer.end();

    this.context.logger.done(`Project created in ${timer.display()}.\n`);

    this.context.logger.info(
      `${chalk.bold('Awesome!')} You are now ready to start coding.\n`,
    );

    this.context.logger.info(
      `Just change the directory: ${chalk.bold.cyan(`cd ${this.name}`)}\n`,
    );

    this.context.logger.info('Happy hacking!\n');

    return 0;
  }
}
