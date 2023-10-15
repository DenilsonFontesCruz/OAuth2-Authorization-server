import { describe, expect, test } from 'vitest';
import { Hasher } from '../../Infrastructure/services/Hasher';
import { TUserRepository } from '../Mock/Repositories/TUserRepository';
import { CreateUser } from '../../Application/useCases/CreateUser';
import {
  ClientLogin,
  EmailNotFoundError,
  PasswordIncorrectError,
} from '../../Application/useCases/ClientLogin';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';

describe('Verify User', async () => {
  const jwtManager = new JwtManager<Identifier>('secret');
  const userRepo = new TUserRepository([]);
  const hasher = new Hasher(1);
  const createUser = new CreateUser(userRepo, hasher);

  await createUser.execute({
    email: 'user@mock.test',
    password: 'User1234',
  });

  test('Correct data', async () => {
    const clientLogin = new ClientLogin(userRepo, hasher, jwtManager);

    const result = await clientLogin.execute({
      email: 'user@mock.test',
      password: 'User1234',
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).not.toBeUndefined();
  });

  test('Wrong email', async () => {
    const clientLogin = new ClientLogin(userRepo, hasher, jwtManager);

    const result = await clientLogin.execute({
      email: 'user1@mock.test',
      password: 'User1234',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(EmailNotFoundError);
  });

  test('Wrong password', async () => {
    const clientLogin = new ClientLogin(userRepo, hasher, jwtManager);

    const result = await clientLogin.execute({
      email: 'user@mock.test',
      password: 'User12345',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(PasswordIncorrectError);
  });
});
