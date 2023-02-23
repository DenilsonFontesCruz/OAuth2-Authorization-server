import { IDatabase } from './IDatabase';

export class DatabaseManager {
  private dbList: Array<IDatabase>;

  constructor(dbList: Array<IDatabase>) {
    this.dbList = dbList;
  }

  async start(): Promise<void> {
    await Promise.all(
      this.dbList.map((database) => {
        return database.start();
      }),
    );
  }

  async stop(): Promise<void> {
    await Promise.all(
      this.dbList.map((database) => {
        return database.stop();
      }),
    );
  }
}
