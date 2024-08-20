export type BaseEntityProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class BaseEntity {
  protected readonly id: BaseEntityProps['id'];
  protected createdAt: BaseEntityProps['createdAt'];
  protected updatedAt: BaseEntityProps['updatedAt'];

  constructor(data: BaseEntityProps) {
    Object.assign(this, data);
  }

  public abstract serialize(): Record<string, unknown>;

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
