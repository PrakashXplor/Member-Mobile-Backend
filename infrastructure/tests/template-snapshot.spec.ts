import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EnvironmentName } from '../enums/environment-name';
import { context as jsonContext } from '../cdk.json';
import { validateEnvironmentContext } from '../utils/validate-environment-context';
import { createMobileGatewayStack } from '../lib/mobile-gateway-stack';

const environments = [EnvironmentName.POC];

expect.addSnapshotSerializer({
  test: (templateItem) => typeof templateItem === 'string',
  print: (templateItem) => {
    const sanitizedTemplateItem = (templateItem as string)
      // Force Hash Replacements - These are generated automatically by CDK
      // See https://blog.bigbandsinger.dev/robust-cdk-snapshot-testing-with-snapshot-serializers
      .replace(/([A-Fa-f0-9]{64})/, 'HASH');
    return `"${sanitizedTemplateItem}"`;
  },
});

environments.forEach((environment) => {
  describe(`${environment} Environment Context Tests`, () => {
    const app = new App({ context: jsonContext });
    const rawContext = app.node.tryGetContext(`environment:${environment}`);

    test('Environment context is valid', () => {
      expect(() => validateEnvironmentContext(rawContext)).not.toThrow();
    });

    test('Environment context matches snapshot', () => {
      const environmentContext = validateEnvironmentContext(rawContext);
      expect(environmentContext).toMatchSnapshot({}, `EnvironmentContext-${environment}`);
    });
  });

  describe(`${environment} CDK Snapshot Tests`, () => {
    const app = new App({ context: jsonContext });
    const rawContext = app.node.tryGetContext(`environment:${environment}`);
    const environmentContext = validateEnvironmentContext(rawContext);

    const mobileGatewayStack = createMobileGatewayStack({
      app,
      environmentContext,
    });

    test('Snapshot test for root Mobile Gateway Stack in the CDK application matches', () => {
      const template = Template.fromStack(mobileGatewayStack);
      expect(template.toJSON()).toMatchSnapshot({}, `MobileGatewayStack-${environment}`);
    });

    test('Snapshot test for the Imported Resources Stack in the CDK application matches', () => {
      const template = Template.fromStack(mobileGatewayStack.importedResources);
      expect(template.toJSON()).toMatchSnapshot({}, `MobileGatewayStack-ImportedResourcesStack-${environment}`);
    });

    test('Snapshot test for the Queues Stack in the CDK application matches', () => {
      const template = Template.fromStack(mobileGatewayStack.gatewayStack);
      expect(template.toJSON()).toMatchSnapshot({}, `MobileGatewayStack-GatewayStack-${environment}`);
    });
  });
});
