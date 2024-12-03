import { ContentType } from '@contentModule/core/enum/content-type.enum';
import { DefaultEntity } from '@contentModule/infra/module/typeorm/entity/default.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { TvShow } from './tv-show.entity';
import { Movie } from './movie.entity';

@Entity({ name: 'Content' })
export class Content extends DefaultEntity<Content> {
  @Column({ nullable: false, type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'varchar' })
  description: string;

  @OneToOne(() => Movie, (movie) => movie.content, {
    cascade: true,
  })
  movie: Movie;

  @OneToOne(() => TvShow, (tvShow) => tvShow.content, {
    cascade: true,
  })
  tvShow?: TvShow;
}
