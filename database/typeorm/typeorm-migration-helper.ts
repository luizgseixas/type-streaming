import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@contentModule/infra/module/config/service/config.service';
import { PersistenceModule } from '@contentModule/persistence/persistence.module';
import { TypeOrmMigrationService } from '@contentModule/infra/module/typeorm/service/typeorm-migration.service';
import { DataSourceOptions } from 'typeorm';
import { createPostgresDatabase } from 'typeorm-extension';

const createDatabaseModule = async () => {
  return NestFactory.createApplicationContext(
    PersistenceModule.forRoot({
      migrations: [__dirname + '/migrations/*'],
    }),
  );
};

export const migrate = async () => {
  const migrationModule = await createDatabaseModule();
  migrationModule.init();
  const configService = migrationModule.get<ConfigService>(ConfigService);
  const options = {
    type: 'postgres',
    ...configService.get('database'),
  } as DataSourceOptions;
  await createPostgresDatabase({
    ifNotExist: true,
    options,
  });
  await migrationModule.get(TypeOrmMigrationService).migrate();
};

export const getDataSource = async () => {
  const migrationModule = await createDatabaseModule();
  return migrationModule.get(TypeOrmMigrationService).getDataSource();
};
