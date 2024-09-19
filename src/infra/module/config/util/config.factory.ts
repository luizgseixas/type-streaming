import { ConfigException } from '../exception/config.exception';
import { configSchema } from './config.schema';
import { Config } from './config.type';

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      url: process.env.DATABASE_URL,
    },
  });

  if (result.success) {
    console.log({ res: result.data });
    return result.data;
  }

  throw new ConfigException(
    `Invalid application configuration ${result.error.message}`,
  );
};
