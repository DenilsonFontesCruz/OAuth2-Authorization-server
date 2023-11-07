import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { User } from '../../Domain/aggregates/userAggregate/User';

export interface IUserRepository {
  findAll(): Promise<User[]>;

  findByEmail(email: string): Promise<User[]>;

  findById(id: Identifier): Promise<User | null>;

  save(user: User): Promise<void>;

  deleteAll(): Promise<void>;

  saveMany(userList: User[]): Promise<void>;
}
