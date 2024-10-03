import { describe, expect, test } from 'vitest';
import { JwtManager } from '../../Infrastructure/Services/JwtManagerJWT';
import { VerifyAuth } from '../../Application/useCases/Auth/VerifyAuth';
import { TCacheManager } from '../Mock/Services/TCacheManager';
import { UserTokenPayload } from '../../../Utils/UserTokenPayload';
import {
  TokenExpired,
  TokenInvalid,
} from '../../Application/errors/ClientErrors';

describe('Verify Auth', async () => {
  const jwtManager = new JwtManager<UserTokenPayload>('secret');
  const cacheManager = new TCacheManager([]);
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

  test('Valid token', async () => {
    const token = jwtManager.sign({ id: 'ID', permissions: ['USER'] });

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toStrictEqual({
      id: 'ID',
      permissions: ['USER'],
    });
  });

  test('Invalid token', async () => {
    const cacheManager = new TCacheManager([]);
    const verifyAuth = new VerifyAuth(cacheManager, jwtManager);

    const token = jwtManager.sign({ id: 'ID', permissions: ['USER'] });

    cacheManager.set(token, '');

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });

  test('Expired token', async () => {
    const token = jwtManager.sign({ id: 'ID', permissions: ['USER'] }, 1);

    const result = await verifyAuth.execute({
      acessToken: token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenExpired);
  });
});
