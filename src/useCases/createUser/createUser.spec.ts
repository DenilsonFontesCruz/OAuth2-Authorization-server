import { describe, it, beforeAll, expect } from 'vitest';
import { UserRepositoryTest } from '../../repository/UserRepositoryTest';
import { Sucess } from '../../shared/core/result';
import { CreateUser } from './createUser';

describe('Create a New User', () => {
  const userRepo = new UserRepositoryTest([]);

  const createUser = new CreateUser(userRepo);

  it('Should returns Sucess', async () => {
    const result = await createUser.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '1234',
    });

    expect(result).toBeInstanceOf(Sucess);
  });
});
