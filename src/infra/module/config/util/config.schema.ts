import { z } from 'zod';

export const environmentSchema = z.enum(['test', 'development', 'production']);

export const databaseSchema = z.object({
  host: z.string(),
  port: z.coerce.number(),
  database: z.string(),
  username: z.string(),
  password: z.string(),
  url: z.string().startsWith('postgresql://'),
});

export const configSchema = z.object({
  env: environmentSchema,
  port: z.coerce.number().positive().int(),
  database: databaseSchema,
});
