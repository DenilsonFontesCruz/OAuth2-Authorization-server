import { IEnviroment } from './IEnviroment';

export const DevEnviroment: IEnviroment = {
  name: 'DevEnviroment',
  database: {
    mongoConfig: { host: 'mongodb://127.0.0.1:27070/Auth' },
    redisConfig: { host: '127.0.0.1', port: 6390 },
  },
};
