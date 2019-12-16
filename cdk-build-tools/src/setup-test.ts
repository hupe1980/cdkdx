import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

import { PackageInfo } from './package-info';

export default async (props: any) => {
  const { rootDir } = props;
  console.log(chalk.dim('\nSetup test suits...', rootDir, '\n'));

  const packageInfo = await PackageInfo.createInstance(rootDir);

  const lambdaDependencies = packageInfo.getLambdaDependencies();
  const mocks: string[] = [];

  if (lambdaDependencies) {
    await Promise.all(
      Object.keys(lambdaDependencies).map(
        async (lambdaPkg): Promise<void> => {
          const lambdaDest = path.join(
            packageInfo.cwd,
            'lambda',
            lambdaDependencies[lambdaPkg]
          );

          if (!(await fs.pathExists(lambdaDest))) {
            await fs.createFile(lambdaDest);
            mocks.push(lambdaDest);
          }
        }
      )
    );
  }

  (global as any).__LAMBDA_DEPENDENCIES_MOCK__ = mocks;
};
