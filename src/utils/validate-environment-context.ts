import { z } from 'zod';

const environmentContextSchema = z.object({
  buildNumber: z.string().default('1'),
  aws: z
    .object({
      account: z
        .object({
          id: z.string().length(12).default('000000000000'),
          region: z.string().default('us-east-1'),
        })
        .default({}),
    })
    .default({}),
  logging: z
    .object({
      account: z.string().default('000000000000'),
      region: z.string().default('us-east-1'),
      bucketArn: z.string().default('arn:aws:s3:::my-logging-bucket'),
      bucketName: z.string().default('my-logging-bucket'),
    })
    .default({}),
  api: z
    .object({
      domain: z.string().default('http://localhost:4566'),
    })
    .default({}),
});

export type EnvironmentContext = z.infer<typeof environmentContextSchema>;

export const validateEnvironmentContext = (context: object): EnvironmentContext =>
  environmentContextSchema.parse({
    ...context,
    buildVersion: process.env.BITBUCKET_BUILD_NUMBER ?? '1',
  });
