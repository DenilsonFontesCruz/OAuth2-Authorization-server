import { Redis } from 'ioredis';
import { ICacheManager, KeyValue } from '../IServices/ICacheManager';

export class CacheManagerRedis implements ICacheManager {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async set(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<void> {
    if (duration) {
      await this.redis.set(key, value, 'EX', duration);
    } else {
      await this.redis.set(key, value);
    }
  }
  async get(key: string): Promise<null | KeyValue> {
    const value = (await this.redis.get(key)) as string;
    if (!value) {
      return null;
    }
    return {
      key,
      value,
    };
  }
  contain(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  remove(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
