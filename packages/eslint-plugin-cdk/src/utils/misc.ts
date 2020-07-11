export interface MethodSignaturParameter {
  name: string;
  type?: string;
}

export const isEqualMethodSignatur = (
  expected: MethodSignaturParameter[],
  actual: MethodSignaturParameter[],
): boolean => {
  if (expected.length !== actual.length) {
    return false;
  }

  for (let i = 0; i < expected.length; i++) {
    if (expected[i].name !== actual[i].name) {
      return false;
    }
    if (expected[i].type) {
      if (expected[i].type !== actual[i].type) {
        return false;
      }
    }
  }

  return true;
};
