import { describe, expect, test } from 'vitest';
import { Hasher } from '../../Infrastructure/services/Hasher';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import {
  GetAuth,
  TokenExpired,
  TokenInvalid,
} from '../../Application/useCases/GetAuth';
import { TCacheManager } from '../Mock/Services/TCacheManager';
import { sleep } from '../Mock/tools/SleepFunction';

describe('Get Auth', async () => {
  const jwtManager = new JwtManager<Identifier>('secret');
  const cacheManager = new TCacheManager([]);
  const getAuth = new GetAuth(cacheManager, jwtManager);

  test('Valid token', async () => {
    const token = jwtManager.sign('ID');

    const result = await getAuth.execute({
      token,
    });

    expect(result.isSuccess).toBeTruthy();
    expect(result.getValue()).toBe('ID');
  });

  test('Invalid token', async () => {
    const cacheManager = new TCacheManager([]);
    const getAuth = new GetAuth(cacheManager, jwtManager);

    const token = jwtManager.sign('ID');

    cacheManager.set(token, '');

    const result = await getAuth.execute({
      token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenInvalid);
  });

  test('Expired token', async () => {
    const token = jwtManager.sign('ID', 1);

    await sleep(3);

    const result = await getAuth.execute({
      token,
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(TokenExpired);
  });
});