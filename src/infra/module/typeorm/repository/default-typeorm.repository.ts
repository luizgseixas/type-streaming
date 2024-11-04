import {
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DefaultEntity } from '../entity/default.entity';

export abstract class DefaultTypeormRepository<T extends DefaultEntity<T>> {
  private repository: Repository<T>;
  constructor(
    readonly entity: EntityTarget<T>,
    readonly dataSource: DataSource,
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findOneById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async deleteAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This method can only be used in test environment');
    }
    const entities = await this.repository.find();
    await this.repository.remove(entities);
  }
}
