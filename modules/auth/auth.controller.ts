import { IUserRepository, User } from './../user';
import { isSameHash } from './../../shared/hashing';

import jwt from 'jsonwebtoken';
import configuration from './../../configuration';

export class AuthController {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async login(email: string, password: string): Promise<{ user: User, token: string}> {
    const user = await this.userRepository.findOne({ email });
    await isSameHash(password, user.password);
    const token = jwt.sign({ email: user.email }, configuration.JWT_SECRET_KEY, { expiresIn: 60 * 60 });;
    return {
      user,
      token
    }
  }

  public async getUser(data: any): Promise<User> {
    return await this.userRepository.findOne(data);
  }
}
