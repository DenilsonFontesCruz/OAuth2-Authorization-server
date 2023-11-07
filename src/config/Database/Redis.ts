import { Redis } from 'ioredis';
import { IManager, IManagerResult } from './IManager';

export interface IConfigRedis {
  host: string;
  port: number;
}

export class RedisManager implements IManager<IConfigRedis, Redis> {
  config: IConfigRedis;

  constructor(config: IConfigRedis) {
    this.config = config;
  }

  async start(): Promise<IManagerResult<Redis>> {
    try {
      const redis = new Redis({
        host: this.config.host,
        port: this.config.port,
      });

      if ((await redis.ping()) != 'PONG') {
        return {
          name: 'Redis',
          connection: false,
        };
      }

      return {
        name: 'Redis',
        connection: true,
        value: redis,
      };
    } catch (err) {
      console.error('Redis Error on Start');
      throw err;
    }
  }
  async close(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
