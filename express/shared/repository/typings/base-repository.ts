import { Document } from 'mongoose';

export interface IBaseRepository<Schema extends Document & M, M> {
  store(model: M): Promise<M>;
  update(id: string, model: M): Promise<M>;
  delete(id: string): Promise<boolean>;
  find(item: M): Promise<M[]>;
  findById(id: string): Promise<M>;
  findOne(data: any): Promise<M>;
}