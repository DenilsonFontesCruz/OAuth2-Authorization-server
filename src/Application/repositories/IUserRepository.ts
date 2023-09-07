import { Nothing } from '../../../Domain-Driven-Design-Types/Generics';
import { User } from '../../Domain/aggregates/userAggregate/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | Nothing>;

  save(user: User): Promise<void>;
}
