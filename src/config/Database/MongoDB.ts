import mongoose from 'mongoose';
import { IManager, IManagerResult } from './IManager';

export interface IConfigMongo {
  host: string;
}

export class MongoManager implements IManager<IConfigMongo> {
  config: IConfigMongo;

  constructor(config: IConfigMongo) {
    this.config = config;
  }

  async start(): Promise<IManagerResult<undefined>> {
    try {
      await mongoose.connect(this.config.host);
      if (mongoose.connection.readyState !== 1) {
        return {
          name: 'Mongo',
          connection: false,
        };
      }
      return {
        name: 'Mongo',
        connection: true,
      };
    } catch (err) {
      console.error('Mongo Error on Start');
      throw err;
    }
  }
  async close(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
