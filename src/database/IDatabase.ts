export interface IDatabase {
  start(): Promise<void>;
  stop(): Promise<void>;
}
