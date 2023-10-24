import { describe, expect, test } from 'vitest';
import {
  ClientLogin,
  ClientLoginOutputBody,
  EmailNotFoundError,
  PasswordIncorrectError,
} from '../../Application/useCases/ClientLogin';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { TCacheManager } from '../Mock/Services/TCacheManager';
import {
  TokenInvalid,
  TokenLogin,
} from '../../Application/useCases/TokenLogin';

describe('Token Login', async () => {
  const jwtManager = new JwtManager<Identifier>('secret');
  const cacheManager = new TCacheManager([]);

  test('Correct data', async () => {
    const cacheManager = new TCacheManager([
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
      result.getValue() as ClientLoginOutputBody;

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
    const cacheManager = new TCacheManager([
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
