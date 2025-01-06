#!/usr/bin/env node
import 'source-map-support/register';
import { App, Tags } from 'aws-cdk-lib';
import { validateEnvironmentContext } from '../../src/utils/validate-environment-context';
import { createMobileGatewayStack } from '../lib/mobile-gateway-stack';

const app = new App();

const environment = process.env.ENV as string;
const cdkContext = app.node.tryGetContext(`environment:${environment}`) as object;

const environmentContext = validateEnvironmentContext({ ...cdkContext });

createMobileGatewayStack({ app, environmentContext });

Tags.of(app).add('Team', 'Mobile');
Tags.of(app).add('Repository', 'Mobile');
Tags.of(app).add('RepositoryUrl', 'https://github.com/PrakashXplor/Member-Mobile-Backend.git');
Tags.of(app).add('DeployedUsing', 'CDK');
