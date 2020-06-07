# cdkdx

> Zero-config CLI for [aws cdk](https://github.com/awslabs/aws-cdk) development

:warning: This is experimental and subject to breaking changes.

## Quick Start

```sh
npx cdkdx create lib my-construct
cd my-construct
```

## Folder structure

```
my-construct
├── README.md
├── node_modules
├── package.json
├── .gitignore
└── src
    ├── __tests__
    ├── lambdas
    │   ├── lambda1
    │   │   ├── __tests__
    │   │   └── index.ts
    │   ├── lambda2
    │   │   └── index.ts
    │   └── shared
    ├── index.ts
    └── my-construct.ts

```

## Lambda development

- Create a separate folder for each lambda
- The file `index.ts` must export the handler function
- LambdaDependencies should be added as devDependencies
- To exclude dependencies when bundling the lambda, an `externals` section can be added in the package.json

```json
// package.json

{
    "name": "construct",
    ...
    "externals": [
        "aws-sdk"
    ]
}
```

```typescript
// construct.ts

import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';

// ...

new Function(this, 'Lambda1', {
  runtime: Runtime.NODEJS_12_X,
  handler: 'index.handler',
  code: Code.fromAsset(path.join(__dirname, 'lambdas', 'lambda1')),
});
```

## Example

See more complete [examples](../../examples).

## License

[MIT](LICENSE)
