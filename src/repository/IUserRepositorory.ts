import { User } from '../domain/user/user';
import { Nothing } from '../shared/types/nothing';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | Nothing>;

  save(user: User): Promise<any>;
}
