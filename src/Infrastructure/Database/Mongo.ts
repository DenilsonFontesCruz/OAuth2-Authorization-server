import mongoose from 'mongoose';

export interface IConfigMongo {
  host: string;
}

export class MongoManager {
  config: IConfigMongo;

  constructor(config: IConfigMongo) {
    this.config = config;
  }

  async start(): Promise<boolean> {
    try {
      await mongoose.connect(this.config.host);
      if (mongoose.connection.readyState !== 1) {
        false;
      }
      return true;
    } catch (err) {
      console.error('Mongo Error on Start');
      throw err;
    }
  }
  async close(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
