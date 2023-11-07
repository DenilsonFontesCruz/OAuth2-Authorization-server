import { describe, expect, test } from 'vitest';
import { TokenLoginOutputBody } from '../../Application/useCases/TokenLogin';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import {
  TokenInvalid,
  TokenLogin,
} from '../../Application/useCases/TokenLogin';
import { TestDependencies } from '../TestDependencies';

const { SERVICES } = TestDependencies;

describe('Token Login', async () => {
  const jwtManager = SERVICES['JwtManager']<Identifier>('secret');
  const cacheManager = SERVICES['CacheManager']();

  test('Correct data', async () => {
    const cacheManager = SERVICES['CacheManager']([
      {
        key: 'RefreshToken',
        value: 'ID',
      },
    ]);

    const tokenLogin = new TokenLogin(jwtManager, cacheManager);

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

    expect(payload).toBe('ID');
  });

  test('Invalid Token', async () => {
    const tokenLogin = new TokenLogin(jwtManager, cacheManager);

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
    const tokenLogin = new TokenLogin(jwtManager, cacheManager);

    const result = await tokenLogin.execute({
      refreshToken: 'RefreshToken',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });
});
