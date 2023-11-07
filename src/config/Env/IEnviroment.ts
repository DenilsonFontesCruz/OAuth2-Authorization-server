import { IConfigMongo } from '../Database/MongoDB';
import { IConfigRedis } from '../Database/Redis';

export interface IEnviroment {
  name: string;
  database: {
    mongoConfig: IConfigMongo;
    redisConfig: IConfigRedis;
  };
}
