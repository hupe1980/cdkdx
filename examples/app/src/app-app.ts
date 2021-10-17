#!/usr/bin/env node
import 'source-map-support/register';

import { App } from '@aws-cdk/core';
import { AppStack } from './app-stack';

const app = new App();
new AppStack(app, 'AppStack');
