#!/usr/bin/env node
import 'source-map-support/register';

import { App } from '@aws-cdk/core';
import { {{name | pascalCase}}Stack } from './{{name}}-stack';

const app = new App();
new {{name | pascalCase}}Stack(app, '{{name | pascalCase}}Stack');
