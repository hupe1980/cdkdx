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
```shell
Build the project

Usage:

$ cdkdx build [-w] [--watch] [--minify-lambdas]

Details:

This command will bundle the lambdas and build the project.

Examples:

Build the project
  $ cdkdx build

Rebuilds on any change
  $ cdkdx build -w
```

### `cdkdx lint`
```shell
Run eslint with prettier

Usage:

$ cdkdx lint [--fix] [--cache] [--report-unused-disable-directives]

Details:

This command runs eslint with prettier.

Examples:

Run linting
  $ cdkdx lint

Fix fixable errors and warnings
  $ cdkdx lint --fix
```

### `cdkdx test`
```shell
Run jest test runner

Usage:

$ cdkdx test 

Details:

All flags are passed through directly to jest.

Examples:

Run jest test runner
  $ cdkdx test

Run jest test runner in watch mode
  $ cdkdx test -w
```

### `cdkdx docgen`
```shell
Generate docs for the project

$ cdkdx docgen
```

### `cdkdx bump`

### `cdkdx release`

### `cdkdx upgrade-cdk`
```shell
Upgrade aws cdk

$ cdkdx upgrade-cdk [--dry-run] [--mode #0] [--version #0] [--skip-dependencies] [--skip-dev-dependencies] [--skip-peer-dependencies]
```

### `cdkdx node`

### `cdkdx create`

## Example

See more complete real world [examples](https://github.com/cloudcomponents/cdk-constructs).

## License

[MIT](LICENSE)
