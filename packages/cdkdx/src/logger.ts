import chalk from 'chalk';

export interface LoggerProps {
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
  disableColors?: boolean;
}

export class Logger {
  private ctx: chalk.Chalk;

  constructor(private readonly props: LoggerProps) {
    this.ctx = new chalk.Instance({
      level: props.disableColors ? 0 : undefined,
    });
  }

  public info(message: string): void {
    this.props.stdout.write(
      `${this.ctx.bgWhite.black(' INFO ')} ${this.ctx.white(message)}\n`,
    );
  }

  public done(message: string): void {
    this.props.stdout.write(
      `${this.ctx.bgGreen.black(' DONE ')} ${this.ctx.green(message)}\n`,
    );
  }

  public warn(message: string): void {
    this.props.stdout.write(
      `${this.ctx.bgYellow.black(' WARN ')} ${this.ctx.yellow(message)}\n`,
    );
  }

  public fail(message: string): void {
    this.props.stderr.write(
      `${this.ctx.bgRed.black(' FAIL ')} ${this.ctx.red(message)}\n`,
    );
  }

  public log(message: string): void {
    this.props.stdout.write(`${message}\n`);
  }
}
