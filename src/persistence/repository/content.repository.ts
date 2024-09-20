import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Content } from '../entity/content.entity';
import { DefaultTypeormRepository } from '@src/infra/module/typeorm/repository/default-typeorm.repository';

export class ContentRepository extends DefaultTypeormRepository<Content> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Content, dataSource);
  }
}
