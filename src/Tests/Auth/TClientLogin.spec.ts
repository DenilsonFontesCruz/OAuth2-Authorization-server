import { describe, expect, test } from 'vitest';
import {
  ClientLogin,
  ClientLoginOutputBody,
} from '../../Application/useCases/Auth/ClientLogin';
import {
  createMockUser,
  getMockUserRawPassword,
} from '../Mock/tools/CreateMockUser';
import { TestDependencies } from '../../Config/Dependencies/TestDependencies';
import { UserTokenPayload } from '../../../Utils/UserTokenPayload';
import {
  EmailNotFoundError,
  PasswordIncorrectError,
} from '../../Application/errors/ClientErrors';

const { SERVICES, REPOSITORIES } = TestDependencies;

describe('Client Login', async () => {
  const jwtManager = SERVICES['JwtManager']<UserTokenPayload>('secret');
  const userRepo = REPOSITORIES['UserRepository']();
  const permissionRepo = REPOSITORIES['PermissionRepository']();
  const hasher = SERVICES['Hasher'](1);
  const userList = await createMockUser(1, hasher);
  await userRepo.saveMany(userList);
  const cacheManager = SERVICES['CacheManager']();

  test('Correct data', async () => {
    const clientLogin = new ClientLogin(
      userRepo,
      permissionRepo,
      hasher,
      jwtManager,
      cacheManager,
      {
        acessTokenDuration: 100,
        refreshTokenDuration: 100,
      },
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
      permissionRepo,
      hasher,
      jwtManager,
      cacheManager,
      {
        acessTokenDuration: 100,
        refreshTokenDuration: 100,
      },
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
      permissionRepo,
      hasher,
      jwtManager,
      cacheManager,
      {
        acessTokenDuration: 100,
        refreshTokenDuration: 100,
      },
    );

    const result = await clientLogin.execute({
      email: userList[0].getEmail().getValue(),
      password: 'WrongPassword',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(PasswordIncorrectError);
  });
});
