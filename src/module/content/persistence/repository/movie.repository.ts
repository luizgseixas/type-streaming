import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DefaultTypeormRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository';
import { Movie } from '../entity/movie.entity';

export class MovieRepository extends DefaultTypeormRepository<Movie> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Movie, dataSource);
  }
}
