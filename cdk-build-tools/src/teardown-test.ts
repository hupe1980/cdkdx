import fs from 'fs-extra';
import chalk from 'chalk';

export default async () => {
  console.log(chalk.dim('Teardown test suits...'));

  const mocks = (global as any).__LAMBDA_DEPENDENCIES_MOCK__ as string[];

  if (mocks?.length > 0) {
    await Promise.all(
      mocks.map(mock => {
        fs.remove(mock);
        console.log(`Remove mock ${chalk.dim(mock)}`);
      })
    );
  }
};
