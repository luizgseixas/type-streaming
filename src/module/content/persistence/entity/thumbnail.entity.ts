import { DefaultEntity } from '@contentModule/infra/module/typeorm/entity/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Thumbnail' })
export class Thumbnail extends DefaultEntity<Thumbnail> {
  @Column({ nullable: false, type: 'varchar' })
  url: string;
}
