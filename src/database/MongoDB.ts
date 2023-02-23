import mongoose from 'mongoose';
import { IDatabase } from './IDatabase';

interface mongoOptions {
  host: string;
  port: string;
}

export class MongoDB implements IDatabase {
  private options: mongoOptions;

  constructor(options: mongoOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    try {
      mongoose.set('strictQuery', true);

      console.log('MongoDB Connection Starting...');
      await mongoose.connect(
        `mongodb://${this.options.host}:${this.options.port}`,
      );
    } catch (error) {
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      console.log('MongoDB Connection Stopping...');
      await mongoose.connection.close();
    } catch (error) {
      throw error;
    }
  }
}
