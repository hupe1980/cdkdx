import chalk from 'chalk';

export interface LoggerProps {
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
}

export class Logger {
  constructor(private readonly props: LoggerProps) {}

  done = (message: string): void => {
    this.props.stdout.write(
      `${chalk.bgGreen.black(' DONE ')} ${chalk.green(message)}\n\n`,
    );
  };

  log = (message: string): void => {
    this.props.stdout.write(`${message}\n\n`);
  };
}
