import chalk from 'chalk';

export const installingDependencies = (packages: string[]): string => {
  const pkgText = packages
    .map((pkg) => `    ${chalk.cyan(chalk.bold(pkg))}`)
    .join('\n');

  return `Installing dependencies:
${pkgText}
`;
};

export const creationComplete = (name: string): string => {
  return `
  ${chalk.green('Awesome!')} You can now start coding. 
   
  You just have to change the directory:
    ${chalk.bold(chalk.cyan(`cd ${name}`))}\n\n`
}