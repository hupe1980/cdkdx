import chalk from 'chalk';

export const installDependencies = (packages: string[]): string => {
  const pkgText = packages
    .map((pkg) => `    ${chalk.bold.cyan(pkg)}`)
    .join('\n');

  return `Installing template dependencies:
${pkgText}
`;
};

export const creationComplete = (name: string): string => {
  return `
  ${chalk.green('Awesome!')} You can now start coding. 
   
  You just have to change the directory:
    ${chalk.bold.cyan(`cd ${name}`)}
    
  Happy hacking!

  `;
};
