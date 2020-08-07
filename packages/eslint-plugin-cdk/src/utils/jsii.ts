import readPkgUp from 'read-pkg-up';

export const isJsiiProject = (cwd: string): boolean => {
  const result = readPkgUp.sync({ cwd, normalize: false });
  return !!result?.packageJson.jsii;
};
