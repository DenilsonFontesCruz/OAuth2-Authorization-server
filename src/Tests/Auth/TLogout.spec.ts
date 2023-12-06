import { describe, expect, test } from 'vitest';
import { VerifyAuth } from '../../Application/useCases/VerifyAuth';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Logout } from '../../Application/useCases/Logout';
import { TestDependencies } from '../../config/Dependencies/TestDependencies';
import crypto from 'crypto';

const { SERVICES } = TestDependencies;

describe('Logout', async () => {
  const jwtManager = SERVICES['JwtManager']<Identifier>('secret');
  const cacheManager = SERVICES['CacheManager']();
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);
  const logout = new Logout(verifyAuth, cacheManager);

  test('Acess Token', async () => {
    const acessToken = jwtManager.sign('ID');
    const refreshToken = crypto.randomBytes(16).toString('hex');

    await cacheManager.set(refreshToken, 'ID');

    const result = await logout.execute({
      refreshToken,
      acessToken,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(await cacheManager.contain(acessToken)).toBeTruthy();
    expect(await cacheManager.contain(refreshToken)).toBeFalsy();
  });
});
