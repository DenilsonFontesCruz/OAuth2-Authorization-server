import { Identifier } from '../../../../Domain-Driven-Design-Types/Generics';
import { IUserRepository } from '../../../Application/repositories/IUserRepository';
import { User } from '../../../Domain/aggregates/userAggregate/User';

export class TUserRepository implements IUserRepository {
  private users: User[];

  public constructor(users?: User[]) {
    if (users == undefined) {
      this.users = [];
    } else {
      this.users = users;
    }
  }
  async deleteAll(): Promise<void> {
    this.users = [];
  }

  async saveMany(userList: User[]): Promise<void> {
    this.users = [...userList, ...this.users];
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByEmail(email: string): Promise<User[]> {
    const users = this.users.filter((user) => {
      return user.getEmail().getValue() === email;
    });

    return users;
  }

  async findById(id: Identifier): Promise<User | null> {
    const user = this.users.find((user) => {
      return user.id === id;
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
