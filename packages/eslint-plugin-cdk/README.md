# eslint-plugin-cdk

:warning: This is experimental and subject to breaking changes.

## Install

```sh
yarn add -D eslint-plugin-cdk
```

## Usage
Add `cdk` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["cdk"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "cdk/ban-lambda-runtimes": [
      "error", 
      { 
        "bannedRuntimes": [
          "NODEJS",
          "NODEJS_4_3",
          "NODEJS_6_10",
          "NODEJS_8_10",
          "NODEJS_10_X",
          "DOTNET_CORE_1",
          "DOTNET_CORE_2",
        ]
      }
    ],
    "cdk/construct-ctor": "error",
    "cdk/construct-props-struct-name": "error",
    "cdk/filename-match-regex": "error",
    "cdk/public-static-property-all-caps": "error",
    "cdk/no-static-import": "error",
    "cdk/stack-props-struct-name": "error",
    "cdk/prefer-type-only-imports": "error",
    "cdk/ban-reserved-words": [
      "error", 
      {
        "wordList": [...PYTHON_RESERVED],
        "jsiiOnly": true,
      }
    ],
  }
}
```

## Rules
| Rule | Description |
| -----| ----------- |
| ban-lambda-runtimes | |
| ban-reserved-words ||
| construct-ctor ||
| construct-props-struct-name ||
| filename-match-regex ||
| no-static-imports ||
| prefer-type-only-imports ||
| public-static-property-all-caps ||
| stack-props-struct-name ||

## Example
See a more complete real world [example](https://github.com/hupe1980/cdkdx/tree/master/packages/eslint-config-cdk)

## License

[MIT](LICENSE)
