import {
  Identifier,
  Nothing,
} from '../../../../Domain-Driven-Design-Types/Generics';
import { IUserRepository } from '../../../Application/repositories/IUserRepository';
import { User } from '../../../Domain/aggregates/userAggregate/User';

export class TUserRepository implements IUserRepository {
  private users: User[];
  private saveCount: number;

  public constructor(users: User[]) {
    this.users = users;
    this.saveCount = 0;
  }

  async getSaveCount(): Promise<number> {
    return this.saveCount;
  }

  async findByEmail(email: string): Promise<Nothing | User> {
    const user = this.users.find((user) => {
      return user.getEmail().getValue() === email;
    });

    if (!user) {
      return '';
    }

    return user;
  }

  async findById(id: Identifier): Promise<Nothing | User> {
    const user = this.users.find((user) => {
      return user.getId() === id;
    });

    if (!user) {
      return '';
    }

    return user;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
    this.saveCount++;
  }
}
