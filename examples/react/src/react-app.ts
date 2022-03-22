#!/usr/bin/env node
import 'source-map-support/register';

import { App } from 'aws-cdk-lib';
import { ReactStack } from './react-stack';

const app = new App();
new ReactStack(app, 'ReactStack');
