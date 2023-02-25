import { User } from '../domain/user/user';
import { Nothing } from '../shared/types/nothing';
import { IUserRepository } from './IUserRepositorory';

export class UserRepositoryTest implements IUserRepository {
  private users: User[];
  private timesSaveCalled: number;

  constructor(users: User[]) {
    this.users = users;
    this.timesSaveCalled = 0;
  }

  getTimesSaveCalled(): number {
    return this.timesSaveCalled;
  }

  async save(user: User): Promise<any> {
    this.users.push(user);
    this.timesSaveCalled++;
  }

  async findByEmail(email: string): Promise<Nothing | User> {
    const user = this.users.find((i) => {
      return i.getEmail().getValue() === email;
    });

    if (!user) {
      return '';
    }

    return user;
  }
}
