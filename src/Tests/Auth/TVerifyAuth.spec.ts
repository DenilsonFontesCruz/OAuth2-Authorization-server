import { describe, expect, test } from 'vitest';
import { JwtManager } from '../../Infrastructure/Services/JwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import {
  VerifyAuth,
  TokenExpired,
  TokenInvalid,
} from '../../Application/useCases/VerifyAuth';
import { TCacheManager } from '../Mock/Services/TCacheManager';

describe('Verify Auth', async () => {
  const jwtManager = new JwtManager<Identifier>('secret');
  const cacheManager = new TCacheManager([]);
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

  test('Valid token', async () => {
    const token = jwtManager.sign('ID');

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBe('ID');
  });

  test('Invalid token', async () => {
    const cacheManager = new TCacheManager([]);
    const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

    const token = jwtManager.sign('ID');

    cacheManager.set(token, '');

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });

  test('Expired token', async () => {
    const token = jwtManager.sign('ID', 1);

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenExpired);
  });
});
