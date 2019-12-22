import path from 'path';
import glob from 'glob';

const getHandlerFile = (handler: string): string | undefined => {
  // Check if handler is a well-formed path based handler.
  const handlerEntry = /(.*)\..*?$/.exec(handler);
  if (handlerEntry) {
    return handlerEntry[1];
  }
  return;
};

const getEntryExtension = async (
  fileName: string,
  { cwd }: { cwd: string }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    glob(
      `${fileName}.*`,
      {
        cwd,
        nodir: true
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        if (files.length === 0) {
          // If we cannot find any handler we should terminate with an error
          return reject(
            new Error(`No matching handler found for '${fileName}' in '${cwd}`)
          );
        }

        return resolve(path.extname(files[0]));
      }
    );
  });
};

export const getEntryForLambda = async (
  handler: string,
  { cwd }: { cwd: string }
): Promise<Record<string, string>> => {
  const handlerFile = getHandlerFile(handler);

  if (!handlerFile) {
    throw new Error(`Entry for ${handler} could not be retrieved.`);
  }

  const ext = await getEntryExtension(handlerFile, { cwd });

  return {
    [handlerFile]: path.join(cwd, `${handlerFile}${ext}`)
  };
};
