import { describe, expect, test } from 'vitest';
import { TokenLoginOutputBody } from '../../Application/useCases/Auth/TokenLogin';
import { TokenLogin } from '../../Application/useCases/Auth/TokenLogin';
import { TestDependencies } from '../../Config/Dependencies/TestDependencies';
import { TokenInvalid } from '../../Application/errors/ClientErrors';
import { UserTokenPayload } from '../../../Utils/UserTokenPayload';

const { SERVICES } = TestDependencies;

describe('Token Login', async () => {
  const jwtManager = SERVICES['JwtManager']<UserTokenPayload>('secret');
  const cacheManager = SERVICES['CacheManager']();

  test('Correct data', async () => {
    const cacheManager = SERVICES['CacheManager']([
      {
        key: 'RefreshToken',
        value: JSON.stringify({ id: 'ID', permissions: ['USER'] }),
      },
    ]);

    const tokenLogin = new TokenLogin(jwtManager, cacheManager, {
      acessTokenDuration: 100,
      refreshTokenDuration: 100,
    });

    const result = await tokenLogin.execute({
      refreshToken: 'RefreshToken',
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).not.toBeUndefined();

    const { acessToken, refreshToken } =
      result.getValue() as TokenLoginOutputBody;

    expect(acessToken).not.toBeUndefined();
    expect(refreshToken).not.toBeUndefined();

    const { payload } = jwtManager.verify(acessToken);

    expect(payload).toStrictEqual({ id: 'ID', permissions: ['USER'] });
  });

  test('Invalid Token', async () => {
    const tokenLogin = new TokenLogin(jwtManager, cacheManager, {
      acessTokenDuration: 100,
      refreshTokenDuration: 100,
    });

    const result = await tokenLogin.execute({
      refreshToken: 'RefreshToken',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });

  test('Empty Value on Cache', async () => {
    const cacheManager = SERVICES['CacheManager']([
      {
        key: 'RefreshToken',
        value: '',
      },
    ]);
    const tokenLogin = new TokenLogin(jwtManager, cacheManager, {
      acessTokenDuration: 100,
      refreshTokenDuration: 100,
    });

    const result = await tokenLogin.execute({
      refreshToken: 'RefreshToken',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });
});
