import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeormRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository';
import { Video } from '../entity/video.entity';

export class VideoRepository extends DefaultTypeormRepository<Video> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Video, dataSource);
  }
}
