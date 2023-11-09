import { Redis } from 'ioredis';

export interface IConfigRedis {
  host: string;
  port: number;
}

export class RedisManager {
  config: IConfigRedis;

  constructor(config: IConfigRedis) {
    this.config = config;
  }

  async start(): Promise<Redis | null> {
    try {
      const redis = new Redis({
        host: this.config.host,
        port: this.config.port,
      });

      if ((await redis.ping()) != 'PONG') {
        return null;
      }

      return redis;
    } catch (err) {
      console.error('Redis Error on Start');
      throw err;
    }
  }
}
