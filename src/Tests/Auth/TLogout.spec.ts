import { describe, expect, test } from 'vitest';
import { VerifyAuth } from '../../Application/useCases/Auth/VerifyAuth';
import { Logout } from '../../Application/useCases/Auth/Logout';
import { TestDependencies } from '../../Config/Dependencies/TestDependencies';
import crypto from 'crypto';
import UserTokenPayload from '../../../Utils/UserTokenPayload';

const { SERVICES } = TestDependencies;

describe('Logout', async () => {
  const jwtManager = SERVICES['JwtManager']<UserTokenPayload>('secret');
  const cacheManager = SERVICES['CacheManager']();
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);
  const logout = new Logout(verifyAuth, cacheManager);

  test('Acess Token', async () => {
    const acessToken = jwtManager.sign({id: 'ID', permissions: ['USER']});
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
