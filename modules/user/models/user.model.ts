import {Document, Schema, Model, model} from "mongoose";
import { User } from "../typings";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

let userModelSchema: Schema = new Schema({
  email: String,
  password: String,
  projects: [String],
  is_admin: Boolean
});

export const UserModelSchema = userModelSchema;

userModelSchema.pre('save', async function(next) {
  const user = this as IUserModel;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
    next()
  } catch(err) {
    next(err);
  }
});

export interface IUserModel extends User, Document {}

export const UserMongooseModel: Model<IUserModel> = model('users', UserModelSchema);