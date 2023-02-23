import { createClient, RedisClientType } from 'redis';
import { IDatabase } from './IDatabase';

interface redisOptions {
  host: string;
  port: string;
}

export class Redis implements IDatabase {
  private options: redisOptions;
  private client: RedisClientType;

  constructor(options: redisOptions) {
    this.options = options;
  }

  async start() {
    try {
      console.log('Redis Connection Starting...');

      this.client = await createClient({
        url: `redis://${this.options.host}:${this.options.port}`,
      });
    } catch (error) {
      throw error;
    }
  }

  async stop() {
    try {
      console.log('Redis Connection Stopping...');

      await this.client.QUIT();
    } catch (error) {
      throw error;
    }
  }

  getClient() {
    return this.client;
  }
}
