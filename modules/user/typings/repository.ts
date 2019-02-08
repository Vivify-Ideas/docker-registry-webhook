import { IBaseRepository } from "../../../shared/repository/typings/base-repository";
import { User } from "./user";
import { IUserModel } from "../models/user.model";

export interface IUserRepository extends IBaseRepository<IUserModel, User> {}