# cdkdx

> Zero-config CLI for [aws cdk](https://github.com/awslabs/aws-cdk) development

- Tsc and jsii compiler support
- Pre-configured linter with custom cdk eslint rules
- Jest test runner setup
- Bundles your lambda functions with parcel builder
- Yarn workspaces compatible

:warning: This is experimental and subject to breaking changes.

## Quick Start

```sh
npx cdkdx create app my-app
cd my-app
```

```sh
npx cdkdx create lib my-construct
cd my-construct
```

## App folder structure

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── cdk.json
└── src
    ├── __tests__
    ├── lambdas
    │   ├── lambda1
    │   │   ├── __tests__
    │   │   └── index.ts
    │   ├── lambda2
    │   │   └── index.ts
    │   └── shared
    ├── my-app.ts
    └── my-stack.ts
```

```json
// cdk.json
{
  "app": "cdkdx node src/my-app.ts"
}
```

## Lib folder structure

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
- Cross lambda code should be placed in the `<root>/src/lambdas/shared` folder

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

## Displaying Lint Output in the Editor

You would need to install an ESLint plugin for your editor first. Then, add a file called `.eslintrc.json` to the project root:

```json
{
  "extends": "cdk"
}
```

## API Reference

### `cdkdx build`

### `cdkdx lint`

### `cdkdx test`

### `cdkdx docgen`

### `cdkdx relase`

### `cdkdx upgrade-cdk`

### `cdkdx node`

### `cdkdx create`

## Example

See more complete real world [examples](https://github.com/cloudcomponents/cdk-constructs).

## License

[MIT](LICENSE)
