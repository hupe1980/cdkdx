# cdkdx

> Zero-config CLI for [aws cdk](https://github.com/awslabs/aws-cdk) development

- [Features](#features)
- [Quick Start](#quick-start)
- [Folder structures](#folder-structures)
  - [App](#app)
  - [Lib](#lib)
- [Lambda development](#lambda-development)
- [Lambda Layer support](#lambda-layer-support)
- [Optimizations](#optimizations)
  - [Moment.js](#moment.js)
- [Customization](#customization) 
  - [Displaying Lint Output in the Editor](#displaying-lint-output-in-the-editor)
  - [Colored output during execution with lerna run](#colored-output-during-execution-with-lerna-run)
  - [Extending webpack config](#extending-webpack-config)
  - [Extending Typescript config](#extending-typescript-config)
- [API Reference](#api-reference)
  - [`cdkdx build`](#cdkdx-build)
  - [`cdkdx lint`](#cdkdx-lint)
  - [`cdkdx test`](#cdkdx-test)
  - [`cdkdx docgen`](#cdkdx-docgen)
  - [`cdkdx bump`](#cdkdx-bump)
  - [`cdkdx release`](#cdkdx-release)
  - [`cdkdx upgrade-cdk`](#cdkdx-upgrade-cdk)
  - [`cdkdx node`](#cdkdx-node)
  - [`cdkdx create`](#cdkdx-create)
- [Example](#example)
- [License](#license)

## Features

- [Tsc](https://github.com/microsoft/TypeScript) and [jsii](https://github.com/aws/jsii) compiler support
- Pre-configured linter with [custom cdk eslint rules](https://github.com/hupe1980/cdkdx/blob/master/packages/eslint-config-cdk)
- Jest test runner setup for testing lambdas and constructs
- Bundles your lambda functions with webpack
- Typechecking for lambdas and constructs 
- Yarn workspaces compatible
- Generates docs for your project
- Lambda layer support
- [React SSR support](examples/react)) 

## Quick Start

```sh
npx cdkdx create app my-app
cd my-app
```

```sh
npx cdkdx create lib my-construct
cd my-construct
```

```sh
npx cdkdx create jsii-lib my-jsii-construct
cd my-jsii-construct
```

## Folder structures

### App

```
my-app
├── API.md
├── README.md
├── LICENCE
├── node_modules
├── package.json
├── .gitignore
├── tsconfig.json
├── tsconfig.eslint.json
├── cdk.json
└── src
    ├── __tests__
    ├── lambdas
    │   ├── tsconfig.json
    │   ├── lambda1
    │   │   ├── __tests__
    │   │   └── index.ts
    │   ├── lambda2
    │   │   └── index.ts
    │   └── shared
    ├── layers
    │   └── demo
    │   │   ├── .dockerignore
    │   │   ├── layer.zip //dummy
    │   │   └── Dockerfile
    ├── my-app.ts
    └── my-stack.ts
```

```json
// cdk.json
{
  "app": "cdkdx node src/my-app.ts"
}
```

### Lib

```
my-construct
├── API.md
├── README.md
├── LICENCE
├── node_modules
├── package.json
├── .gitignore
├── tsconfig.json
├── tsconfig.eslint.json
└── src
    ├── __tests__
    ├── lambdas
    │   ├── tsconfig.json
    │   ├── lambda1
    │   │   ├── __tests__
    │   │   └── index.ts
    │   ├── lambda2
    │   │   └── index.ts
    │   └── shared
    ├── layers
    │   └── demo
    │   │   ├── .dockerignore
    │   │   ├── layer.zip //dummy
    │   │   └── Dockerfile
    ├── index.ts
    └── my-construct.ts
```

## Lambda development

- Create a separate folder for each lambda
- The file `index.ts` must export the handler function
- LambdaDependencies should be added as devDependencies
- @types/aws-lambda must be used as type only import:

```typescript
import type { Handler } from 'aws-lambda';
```
- To exclude dependencies when bundling the lambda, an `externals` section can be added in the package.json:

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
- Use the `nodeModules` section to specify a list of modules that should not be bundled but instead included in the node_modules folder of the Lambda package.

```json
// package.json

{
  "name": "construct",
  ...
  "nodeModules": [
    "express"
  ]
}
```
- Cross lambda code should be placed in the `<root>/src/lambdas/shared` folder
- The Path must be passed to the aws-lambda construct with a code object:

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

## Lambda Layer support

- Create a separate folder for each layer
- The folder must contain a Dockerfile
- Add a dummy layer.zip file to prevent test cases from aborting 
- Docker muss be installed!

```typescript
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';

/**
 * A demo Lambda layer.
 */
export class DemoLayer extends lambda.LayerVersion {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layers', 'demo', 'layer.zip'), {
        // we hash the Dockerfile (it contains the tools versions) because hashing the zip is non-deterministic
        assetHash: hashFile(path.join(__dirname, 'layers', 'demo', 'Dockerfile')),
      }),
      description: '/opt/demo',
    });
  }
}

function hashFile(fileName: string) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(fileName))
    .digest('hex');
}
```

## Optimizations

### Moment.js
If you use [Moment.js](https://momentjs.com/), only the English locale is available by default. To add a specific Moment.js locale to your bundle, you need to import it explicitly.

```typescript
import moment from 'moment';
import 'moment/locale/fr';
```

## Customization

### Displaying Lint Output in the Editor

You would need to install an ESLint plugin for your editor first. Then, add a file called `.eslintrc.json` to the project root:

```json
{
  "extends": "cdk"
}
```

### Colored output during execution with lerna run
```json
// package.json
"scripts": {
    "build": "FORCE_COLOR=1 lerna run build"
}
```

### Extending webpack config
To extend the configuration, create a cdkdx.config.js file at the root of your project und use the webpack field:

```javascript
// cdkdx.config.js

module.exports = {
  webpack: (config, projectInfo) => config
}
```
Make sure to preserve the following config options:
- entry
- output

### Extending Typescript config
To extend the typescript configuration, create a cdkdx.config.js config file as described above. 
Use the lambdaTsConfig field, which gives you a partial configuration object (and project info as second argument).
```javascript
module.exports = {
    lambdaTsConfig: (config, projectInfo) => {
        config.compilerOptions = {
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }

        return config;
    } 
}
```
## API Reference

### `cdkdx build`
```shell
Build the project

Usage:

$ cdkdx build [-w] [--watch] [--minify-lambdas] [--ignore-layers]

Details:

This command will bundle the lambdas, build the layers and build the project.

Examples:

Build the project
  $ cdkdx build

Rebuilds on any change
  $ cdkdx build -w
```

### `cdkdx lint`
```shell
Run eslint with prettier and custom cdk rules

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
  $ cdkdx test --watch
```

### `cdkdx docgen`
```shell
Generate docs for the project

$ cdkdx docgen
```

### `cdkdx bump`

### `cdkdx release`
```shell
Release the project

Usage:

$ cdkdx release <type>

Details:

This command releases the project to npm, pypi or both.

It is checked whether the package version is not yet registered. If the version is not in the registry, it will be released. Otherwise the process will be ignored.

Examples:

Release to npm
  $ cdkdx release npm

Release to pypi
  $ cdkdx release pypi
```

### `cdkdx upgrade-cdk`
```shell
Upgrade aws cdk

$ cdkdx upgrade-cdk [--dry-run] [--mode #0] [--version #0] [--skip-dependencies] [--skip-dev-dependencies] [--skip-peer-dependencies]
```

### `cdkdx node`
```shell
Execute cdk apps

Usage:

$ cdkdx node <script>

Details:

This command bundles the lambdas, compiles the app and adds support for .env files to the cdk app.
It is usually specified in the cdk.json file:

// cdk.json
{
  "app": "cdkdx node src/your-app.ts",
  "context": ...
}

```

### `cdkdx create`
```shell
Create a new, empty CDK project from a template

Usage:

$ cdkdx create 

Details:

This command will create a new, empty CDK project from a template.

Examples:

Create a cdk app
  $ npx cdkdx create app my-app

Create a cdk lib
  $ npx cdkdx create lib my-lib

Create a jsii cdk lib
  $ npx cdkdx create jsii-lib my-lib
```

## Example

See more complete real world [examples](https://github.com/cloudcomponents/cdk-constructs).

## License

[MIT](LICENSE)
