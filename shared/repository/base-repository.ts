import { Model, Document } from 'mongoose';

export class BaseRepository<Schema extends Document & M, M> {

  constructor(
    protected model: Model<Schema>
  ) {}

  store(model: M): Promise<M> {
    return this.model.create(model);
  }

  update(id: string, model: M): Promise<M> {
    return this.model.update({
      id
    }, model).exec();
  }

  async delete(id: string): Promise<boolean> {
    const { ok } = await this.model.deleteOne({
      id
    }).exec();

    return ok
      ? Promise.resolve(true)
      : Promise.reject();
  }

  find(item: M): Promise<M[]> {
    return this.model.find(item).exec();
  }

  findById(id: string): Promise<M> {
    return this.model.findById(id).exec();
  }

  findOne(data: any): Promise<M> {
    return this.model.findOne(data).exec();
  }
}