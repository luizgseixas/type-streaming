import { DynamicModule, Module } from '@nestjs/common';
import { DefaultEntity } from './entity/default.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/service/config.service';
import { TypeOrmMigrationService } from './service/typeorm-migration.service';

@Module({})
export class TypeOrmPersistenceModule {
  static forRoot(options: {
    migrations?: string[];
    entities?: Array<typeof DefaultEntity>;
  }): DynamicModule {
    return {
      module: TypeOrmPersistenceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useFactory: async (...args: any[]) => {
            const configService: ConfigService | undefined = args.find(
              (arg) => arg instanceof ConfigService,
            );

            if (!configService) {
              throw new Error('ConfigService not found');
            }

            return {
              type: 'postgres' as const,
              logging: false,
              autoLoadEntities: false,
              synchronize: false,
              migrationsTableName: 'typeorm_migrations',
              ...configService.get('database'),
              ...options,
            };
          },
        }),
      ],
      providers: [TypeOrmMigrationService],
      exports: [TypeOrmMigrationService],
    };
  }
}
