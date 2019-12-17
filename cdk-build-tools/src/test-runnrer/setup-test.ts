import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import glob from 'glob';

import { PackageInfo } from '../package-info';

const globPackageInfos = async (): Promise<PackageInfo[]> =>
  new Promise((resolve, reject) => {
    glob('./packages/*', (err, files) => {
      if (err) {
        return reject(err);
      }
      const packageInfos = Promise.all(files.map(file => PackageInfo.createInstance(file)))
      return resolve(packageInfos);
    });
  });

const mockLamdaDependencies = async (packageInfos: PackageInfo[]) => {
  const mocks: string[] = [];
  await Promise.all(packageInfos.map(async packageInfo => {
    const lambdaDependencies = packageInfo.getLambdaDependencies();

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
              console.log(`Create mock ${chalk.dim(lambdaDest)}`);
              mocks.push(lambdaDest);
            }
          }
        )
      );
    }
  }));

  return mocks;
}

export default async (props: any) => {
  const { rootDir } = props;

  console.log(chalk.dim('\nGlobal setup...', '\n'));

  const packageInfo = await PackageInfo.createInstance(rootDir);

  const packageInfos = packageInfo.isRoot()
    ? await globPackageInfos()
    : [packageInfo];

  //console.log(packageInfos);

  const mocks = await mockLamdaDependencies(packageInfos);

  (global as any).__LAMBDA_DEPENDENCIES_MOCKS__ = mocks;
};
