//https://github.com/typescript-eslint/typescript-eslint/issues/2388

import 'typescript';

declare module 'typescript' {
  type NamedTupleMember = Node;
}
