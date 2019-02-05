import { User, IUserRepository } from "./typings";
import { IUserModel, UserMongooseModel } from './models/user.model';
import { BaseRepository } from "./../../shared/repository/base-repository";

export class UserRepository extends BaseRepository<IUserModel, User> implements IUserRepository {
  constructor() {
    super(UserMongooseModel);
  }
}
