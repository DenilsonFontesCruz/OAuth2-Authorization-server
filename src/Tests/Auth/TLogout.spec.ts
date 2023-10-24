import { describe, expect, test } from 'vitest';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { TCacheManager } from '../Mock/Services/TCacheManager';
import { VerifyAuth } from '../../Application/useCases/VerifyAuth';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Logout } from '../../Application/useCases/Logout';

describe('Logout', async () => {
  const jwtManager = new JwtManager<Identifier>('secret');
  const cacheManager = new TCacheManager([]);
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
