import { describe, expect, test } from 'vitest';
import { CreateUser } from '../../Application/useCases/CreateUser';
import {
  ClientLogin,
  ClientLoginOutputBody,
  EmailNotFoundError,
  PasswordIncorrectError,
} from '../../Application/useCases/ClientLogin';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import {
  createMockUser,
  getMockUserRawPassword,
} from '../Mock/tools/CreateMockUser';
import { TestDependencies } from '../TestDependencies';

const { SERVICES, REPOSITORIES } = TestDependencies;

describe('Client Login', async () => {
  const jwtManager = SERVICES['JwtManager']<Identifier>('secret');
  const userRepo = REPOSITORIES['UserRepository']();
  const hasher = SERVICES['Hasher'](1);
  const userList = await createMockUser(1, hasher);
  await userRepo.saveMany(userList);
  const cacheManager = SERVICES['CacheManager']();

  test('Correct data', async () => {
    const clientLogin = new ClientLogin(
      userRepo,
      hasher,
      jwtManager,
      cacheManager,
    );

    const result = await clientLogin.execute({
      email: userList[0].getEmail().getValue(),
      password: getMockUserRawPassword(0),
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).not.toBeUndefined();

    const { acessToken, refreshToken } =
      result.getValue() as ClientLoginOutputBody;

    expect(acessToken).not.toBeUndefined();
    expect(refreshToken).not.toBeUndefined();
  });

  test('Wrong email', async () => {
    const clientLogin = new ClientLogin(
      userRepo,
      hasher,
      jwtManager,
      cacheManager,
    );

    const result = await clientLogin.execute({
      email: 'wrong@email.test',
      password: getMockUserRawPassword(0),
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(EmailNotFoundError);
  });

  test('Wrong password', async () => {
    const clientLogin = new ClientLogin(
      userRepo,
      hasher,
      jwtManager,
      cacheManager,
    );

    const result = await clientLogin.execute({
      email: userList[0].getEmail().getValue(),
      password: 'WrongPassword',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(PasswordIncorrectError);
  });
});
