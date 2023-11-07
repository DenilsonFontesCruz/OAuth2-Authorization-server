import { describe, expect, test } from 'vitest';
import { VerifyAuth } from '../../Application/useCases/VerifyAuth';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Logout } from '../../Application/useCases/Logout';
import { TestDependencies } from '../TestDependencies';

const { SERVICES } = TestDependencies;

describe('Logout', async () => {
  const jwtManager = SERVICES['JwtManager']<Identifier>('secret');
  const cacheManager = SERVICES['CacheManager']();
  const verifyAuth = new VerifyAuth(cacheManager, jwtManager);
  const logout = new Logout(verifyAuth, cacheManager);

  test('Acess Token', async () => {
    const token = jwtManager.sign('ID');

    const result = await logout.execute({
      token,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(await cacheManager.contain(token)).toBeTruthy();
  });
});
