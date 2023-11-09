import {
  IConfigMongo,
  MongoManager,
} from '../../Infrastructure/Database/Mongo';
import {
  IConfigRedis,
  RedisManager,
} from '../../Infrastructure/Database/Redis';
import { UserRepositoryMongo } from '../../Infrastructure/Repository/UserRepositoryMongo';
import { CacheManagerRedis } from '../../Infrastructure/services/CacheManagerRedis';
import { Hasher } from '../../Infrastructure/services/Hasher';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { IDependencies, IDependenciesManager } from './IDependencies';

interface DependenciesConfig {
  database: {
    mongo: IConfigMongo;
    redis: IConfigRedis;
  };
  services: {
    hasher: {
      salt: number;
    };
    jwtManager: {
      secret: string;
    };
  };
}

export class DevDependencies implements IDependenciesManager {
  config: DependenciesConfig;

  constructor(config: DependenciesConfig) {
    this.config = config;
  }

  async start(): Promise<IDependencies> {
    try {
      const mongoManager = new MongoManager(this.config.database.mongo);
      const redisManager = new RedisManager(this.config.database.redis);

      if (!(await mongoManager.start())) {
        throw new Error('Mongo connection error');
      }

      const redis = await redisManager.start();

      if (!redis) {
        throw new Error('Redis connection error');
      }

      return {
        userRepository: new UserRepositoryMongo(),
        cacheManager: new CacheManagerRedis(redis),
        hasher: new Hasher(this.config.services.hasher.salt),
        jwtManager: new JwtManager(this.config.services.jwtManager.secret),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
