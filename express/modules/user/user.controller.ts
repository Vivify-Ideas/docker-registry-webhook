import { User, IUserRepository } from './typings';

export class UserController {
  constructor(
    private userRepository: IUserRepository
  ) { }

  public store(user: User): Promise<User> {
    return this.userRepository.store(user);
  }

  public get(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}