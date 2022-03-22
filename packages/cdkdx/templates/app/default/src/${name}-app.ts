#!/usr/bin/env node
import 'source-map-support/register';

import { App } from 'aws-cdk-lib';
import { ${pascalCase(name)}Stack } from './${name}-stack';

const app = new App();
new ${pascalCase(name)}Stack(app, '${pascalCase(name)}Stack');
